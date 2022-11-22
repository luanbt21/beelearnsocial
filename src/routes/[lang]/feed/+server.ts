import { json, type RequestHandler } from '@sveltejs/kit'
import { loadPosts } from './service'

export const GET: RequestHandler = async ({ locals, url }) => {
	const page = Number(url.searchParams.get('page')) || 0
	const posts = await loadPosts({ user: locals.user, page })
	return json(posts)
}
