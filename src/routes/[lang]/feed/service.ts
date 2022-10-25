import { prisma } from '$lib/prisma'

export const getPosts = async (page = 0, limit = 5) => {
	return await prisma.post.findMany({
		skip: page * limit,
		take: limit,
		include: {
			author: true,
			tags: true,
			reactions: true,
		},
	})
}
