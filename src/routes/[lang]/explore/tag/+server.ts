import { json, type RequestHandler } from '@sveltejs/kit'
import { loadPosts } from './service'

export const GET: RequestHandler = async ({ url, locals }) => {
	const page = Number(url.searchParams.get('page')) || 0
	const name = url.searchParams.get('name') || ''
	const posts = await loadPosts({ tagName: name, user: locals.user, page })
	return json(posts)
}
