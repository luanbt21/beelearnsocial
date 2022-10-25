import type { PageServerLoad } from './$types'
import { getPosts } from './service'

export const load: PageServerLoad = async () => {
	return { posts: await getPosts() }
}
