import { postInclude } from '$lib/constant'
import { prisma } from '$lib/prisma'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const posts = await prisma.post.findMany({
		where: {
			learnLevels: {
				some: {
					level: Number(params.level),
					user: {
						uid: params.uid,
					},
				},
			},
		},
		include: postInclude,
	})
	return { posts: posts.map((post) => ({ ...post, repeating: true })) }
}
