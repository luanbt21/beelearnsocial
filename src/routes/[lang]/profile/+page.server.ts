import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

import { prisma } from '$lib/prisma'

export const load: PageServerLoad = async ({ locals }) => {
	const { locale, uid } = locals
	if (!uid) {
		throw redirect(307, `/${locale}/login`)
	}
	return {
		user: prisma.user.findFirst({
			where: {
				uid,
			},
		}),
	}
}
