import { postInclude } from '$lib/constant'
import { prisma } from '$lib/prisma'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const user = await prisma.user.findFirst({
		where: {
			uid: params.uid,
		},
		select: {
			hiddenPostIDs: true,
		},
	})
	if (!user) throw error(404, 'User not found')
	const posts = await prisma.post.findMany({
		where: {
			id: {
				in: user.hiddenPostIDs,
			},
		},
		include: postInclude,
	})
	return { posts: posts.map((post) => ({ ...post, repeating: true })) }
}
