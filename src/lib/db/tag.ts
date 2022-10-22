import { prisma } from '$lib/prisma'
import dayjs from 'dayjs'

export async function getTopTags() {
	const tagIDs = await prisma.analytics.groupBy({
		where: {
			createdAt: {
				gte: dayjs().startOf('day').subtract(30, 'day').toDate(),
			},
		},
		by: ['tagId'],
		// _sum: {
		// 	count: true,
		// },
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
				select: {
					name: true,
					posts: {
						orderBy: {
							reactions: {
								_count: 'desc',
							},
						},
					},
				},
			})
		}),
	)
	return tags
}
