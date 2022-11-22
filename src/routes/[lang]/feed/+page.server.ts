import type { PageServerLoad } from './$types'
import { loadPosts } from './service'

export const load: PageServerLoad = async ({ locals }) => {
	return {
		posts: await loadPosts({ user: locals.user }),
	}
}
