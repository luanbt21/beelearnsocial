import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const { locale, user } = locals
	if (!user) {
		throw redirect(307, `/${locale}/login`)
	}
	throw redirect(307, `/${locale}/profile/${user.uid}`)
}
