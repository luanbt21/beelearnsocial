import { prisma } from '$lib/prisma'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const learnLevel = await prisma.learnLevel.findMany({
		where: {
			level: Number(params.level),
			user: {
				uid: params.uid,
			},
		},
		select: {
			post: {
				include: {
					author: true,
					tags: true,
					reactions: {
						select: {
							userId: true,
						},
					},
				},
			},
		},
	})
	return { posts: learnLevel.map((l) => ({ ...l.post, repeating: true })) }
}
