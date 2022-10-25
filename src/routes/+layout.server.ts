import type { LayoutServerLoad } from './$types'
import { getTopTags } from '$lib/db/tag'

export const load: LayoutServerLoad = async ({ locals: { locale } }) => {
	return { locale, tags: await getTopTags({ posts: false }) }
}
