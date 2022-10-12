import type { PageServerLoad } from './$types'
import { prisma } from '$lib/prisma'

export const load: PageServerLoad = async ({ params }) => {
	const { uid } = params
	return {
		user: prisma.user.findFirst({
			where: {
				uid,
			},
		}),
	}
}
