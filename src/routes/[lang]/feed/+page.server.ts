import { prisma } from '$lib/prisma'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return {
		posts: prisma.post.findMany({
			include: {
				author: true,
				tags: true,
				reactions: true,
			},
		}),
	}
}
