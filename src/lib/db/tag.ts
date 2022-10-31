import { prisma } from '$lib/prisma'
import dayjs from 'dayjs'

export async function getTopTags(include = { posts: true }) {
	const tagIDs = await prisma.analytics.groupBy({
		where: {
			createdAt: {
				gte: dayjs().startOf('day').subtract(30, 'day').toDate(),
			},
		},
		by: ['tagId'],
		orderBy: {
			_sum: {
				count: 'desc',
			},
		},
	})

	const tags = await Promise.all(
		tagIDs.map(async ({ tagId }) => {
			return await prisma.tag.findFirst({
				where: {
					id: tagId,
				},
				include: {
					posts: include.posts
						? {
								include: { author: true },
								orderBy: {
									reactions: {
										_count: 'desc',
									},
								},
						  }
						: false,
				},
			})
		}),
	)
	return tags
}

export const searchTag = async (q: string) => {
	return await prisma.tag.findMany({
		where: {
			name: {
				contains: q,
			},
		},
		select: {
			id: true,
			name: true,
			description: true,
			_count: { select: { posts: true } },
		},
		orderBy: {
			posts: { _count: 'desc' },
		},
	})
}
