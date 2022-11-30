import { getCollections } from '$lib/db/collections'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return

	return {
		collections: await getCollections(locals.user.id),
	}
}
