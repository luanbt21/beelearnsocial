import { prisma } from '$lib/prisma'
import type { User } from '@prisma/client'

export const getPosts = async ({
	user,
	page = 0,
	limit = 5,
}: {
	user?: User
	page?: number
	limit?: number
}) => {
	return await prisma.post.findMany({
		where: {
			id: user
				? {
						notIn: user.hiddenPostIDs,
				  }
				: undefined,
		},
		skip: page * limit,
		take: limit,
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			author: true,
			tags: true,
			reactions: {
				select: {
					userId: true,
				},
			},
		},
	})
}
