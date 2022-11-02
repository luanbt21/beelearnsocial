import { prisma } from '$lib/prisma'
import dayjs from 'dayjs'

export async function getTopTags() {
	return await prisma.tag.findMany({
		include: {
			posts: {
				take: 5,
				include: {
					author: true,
					reactions: {
						where: {
							createdAt: {
								gte: dayjs().startOf('day').subtract(30, 'day').toDate(),
							},
						},
					},
				},
				orderBy: {
					reactions: { _count: 'desc' },
				},
			},
		},
		orderBy: {
			posts: { _count: 'desc' },
		},
	})
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
