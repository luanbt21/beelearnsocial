import { getPost } from '$lib/db/post'
import { prisma } from '$lib/prisma'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals }) => {
	const id = url.searchParams.get('id')
	if (!id) throw error(400)

	const post = await getPost(id)
	if (!post) throw error(404, 'Post not found')

	if (!locals.user) {
		return { post: { ...post, repeating: false } }
	}
	const repeating = (await prisma.learnLevel.findFirst({
		where: { userId: locals.user.id, postId: id },
	}))
		? true
		: false
	return { post: { ...post, repeating } }
}
