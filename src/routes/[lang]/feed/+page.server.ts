import type { PageServerLoad } from './$types'
import { getPosts } from './service'

export const load: PageServerLoad = async ({ locals }) => {
	return { posts: await getPosts({ user: locals.user }) }
}
