import { searchPost } from '$lib/db/post'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q') ?? ''
	const page = Number(url.searchParams.get('page')) || 0
	return json(await searchPost(q, page))
}
