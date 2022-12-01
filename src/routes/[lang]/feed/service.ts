import { getPosts } from '$lib/db/post'
import { prisma } from '$lib/prisma'

export const loadPosts = async ({ user, page = 0 }: { user?: User; page?: number }) => {
	const limit = 5
	if (!user) {
		const newPosts = await getPosts({ page, limit })
		return newPosts.map((p) => ({ ...p, repeating: false }))
	}

	// Up level for learned post.
	if (page > 0) {
		const upLearnLevels = await findLearnLevels({ userId: user.id, limit })
		await prisma.learnLevel.updateMany({
			where: { id: { in: upLearnLevels.map(({ id }) => id) } },
			data: { repeating: false },
		})
	}

	const learnLevels = await findLearnLevels({ userId: user.id, limit })
	const repeatingPostIDs = learnLevels.map(({ post }) => post.id)

	// need to hide hidden posts
	const repeatingPosts = repeatingPostIDs.length
		? await getPosts({
				where: {
					id: {
						in: repeatingPostIDs,
						notIn: user.hiddenPostIDs,
					},
				},
				page,
		  })
		: []

	const posts = repeatingPosts.map((p) => ({ ...p, repeating: true }))

	if (posts.length < 4) {
		const newPosts = await getPosts({
			where: {
				id: {
					notIn: [...user.hiddenPostIDs, ...learnLevels.map(({ post }) => post.id)],
				},
				learnLevels: {
					none: {
						userId: user.id,
					},
				},
			},
			page,
		})
		posts.push(...newPosts.map((p) => ({ ...p, repeating: false })))
	}
	return posts
}

export const findLearnLevels = async ({ userId, limit }: { userId: string; limit: number }) => {
	return await prisma.learnLevel.findMany({
		where: {
			userId,
			repeating: true,
		},
		select: {
			id: true,
			post: {
				select: {
					id: true,
				},
			},
		},
		orderBy: {
			updatedAt: 'asc',
		},
		take: limit,
	})
}
