import { getPosts, isRepeating } from '$lib/db/post'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals, params, url }) => {
	const page = Number(url.searchParams.get('page')) || 0
	const posts = await getPosts({
		where: {
			author: {
				uid: params.uid,
			},
		},
		page,
	})
	return json(
		await Promise.all(
			posts.map(async (post) => ({
				...post,
				repeating: await isRepeating({ userId: locals.user?.id, postId: post.id }),
			})),
		),
	)
}
