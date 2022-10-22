import { getPosts } from '$lib/db/post'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return {
		posts: await getPosts(),
	}
}
