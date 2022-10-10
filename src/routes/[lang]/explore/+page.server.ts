import type { PageServerLoad } from './$types'
import { getTopTags } from '$lib/db/tag'

export const load: PageServerLoad = async () => {
	return {
		tags: getTopTags(),
	}
}
