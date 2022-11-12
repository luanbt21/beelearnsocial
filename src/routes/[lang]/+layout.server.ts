import type { LayoutServerLoad } from './$types'
import { getTopTags } from '$lib/db/tag'

export const load: LayoutServerLoad = async () => {
	return { tags: await getTopTags() }
}
