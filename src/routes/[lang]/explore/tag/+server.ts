import { json, type RequestHandler } from '@sveltejs/kit'
import { getPosts } from '$lib/db/post'

export const GET: RequestHandler = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 0
	const name = url.searchParams.get('name') || ''
	const posts = await getPosts({
		where: { tags: { some: { name } } },
		page,
	})
	return json(posts)
}
