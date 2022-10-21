import { getCollections } from '$lib/db/collections'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const { locale, user } = locals
	if (!user) {
		throw redirect(307, `/${locale}/login`)
	}
	return {
		collections: await getCollections(locals.user.id),
	}
}
