import { isRepeating, getPost } from '$lib/db/post'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals }) => {
	const id = url.searchParams.get('id')
	if (!id) throw error(400)

	const post = await getPost(id)
	if (!post) throw error(404, 'Post not found')

	return {
		post: {
			...post,
			repeating: await isRepeating({ userId: locals.user?.id, postId: id }),
		},
	}
}
