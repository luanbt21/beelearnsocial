import { likePost, dislikePost } from '$lib/db/reaction'
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

const verifyId = async ({ locals, request }: { locals: App.Locals; request: Request }) => {
	if (!locals.user) {
		throw redirect(307, `/${locals.locale}/login`)
	}
	const data = await request.formData()
	const postId = <string>data.get('postId')
	return {
		userId: locals.user.id,
		postId,
	}
}

export const actions: Actions = {
	like: async ({ locals, request }) => {
		const params = await verifyId({ locals, request })
		return await likePost(params)
	},
	dislike: async ({ locals, request }) => {
		const params = await verifyId({ locals, request })
		return await dislikePost(params)
	},
}
