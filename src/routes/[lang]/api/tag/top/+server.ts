import type { RequestHandler } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'
import { getTopTags } from '$lib/db/tag'

export const GET: RequestHandler = async () => {
	const tags = await getTopTags()
	return json(tags)
}
