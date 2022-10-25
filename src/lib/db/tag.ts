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

	const tags = Promise.all(
		tagIDs.map(async ({ tagId }) => {
			return await prisma.tag.findFirst({
				where: {
					id: tagId,
				},
				include: {
					posts: include.posts
						? {
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
