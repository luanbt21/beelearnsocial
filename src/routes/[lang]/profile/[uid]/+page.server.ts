import type { PageServerLoad } from './$types'
import { prisma } from '$lib/prisma'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
	const { uid } = params
	const user = await prisma.user.findFirst({
		where: {
			uid,
		},
		include: {
			collections: true,
			followedBy: {
				include: {
					_count: true,
				},
			},
		},
	})
	if (!user) {
		throw error(404, 'User not found')
	}
	return { user }
}
