import type { PageServerLoad } from './$types'
import { getPosts } from '$lib/db/post'

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user
	return {
		posts: await getPosts({
			where: {
				id: user
					? {
							notIn: user.hiddenPostIDs,
					  }
					: undefined,
			},
		}),
	}
}
