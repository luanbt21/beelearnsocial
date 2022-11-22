import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ locals }) => {
	const { locale, user } = locals
	if (!user) {
		return
	}
	throw redirect(307, `/${locale}/profile/${user.uid}`)
}
