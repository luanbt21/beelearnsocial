import { getPosts } from '$lib/db/post'
import { prisma } from '$lib/prisma'

export const loadPosts = async ({ user, page = 0 }: { user?: User; page?: number }) => {
	const limit = 5
	if (!user) {
		const newPosts = await getPosts({ page, limit })
		return newPosts.map((p) => ({ ...p, repeating: false }))
	}

	const learnLevels = await prisma.learnLevel.findMany({
		where: {
			userId: user.id,
		},
		select: {
			id: true,
			repeating: true,
			post: {
				select: {
					id: true,
				},
			},
		},
		orderBy: {
			updatedAt: 'asc',
		},
		take: page > 0 ? 2 * limit : limit,
	})

	// Up level for learned post.
	if (page > 0 && learnLevels.length > 0) {
		await prisma.learnLevel.updateMany({
			where: {
				id: {
					in: learnLevels.slice(0, limit).map(({ id }) => id),
				},
			},
			data: {
				repeating: false,
			},
		})
	}

	const repeatingPostIDs = learnLevels
		.slice(page === 0 ? 0 : limit)
		.reduce<Array<string>>((array, learnLevel) => {
			if (learnLevel.repeating) {
				array.push(learnLevel.post.id)
			}
			return array
		}, [])

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
