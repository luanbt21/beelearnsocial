import { searchTag } from '$lib/db/tag'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q') ?? ''
	return json(await searchTag(q))
}
