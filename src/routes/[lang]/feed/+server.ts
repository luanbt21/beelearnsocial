import { json, type RequestHandler } from '@sveltejs/kit'
import { getPosts } from './service'

export const GET: RequestHandler = async ({ locals, url }) => {
	const page = Number(url.searchParams.get('page')) || 0
	const posts = await getPosts({ user: locals.user, page })
	return json(posts)
}
