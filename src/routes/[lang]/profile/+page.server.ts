import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const { locale, uid } = locals
	console.log('server')

	if (!uid) {
		throw redirect(307, `/${locale}/login`)
	}
	throw redirect(307, `/${locale}/profile/${uid}`)
}
