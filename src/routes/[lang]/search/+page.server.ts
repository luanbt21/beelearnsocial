import { searchPost } from '$lib/db/post'
import { searchTag } from '$lib/db/tag'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? ''
	return {
		tags: await searchTag(q),
		posts: await searchPost(q),
	}
}
