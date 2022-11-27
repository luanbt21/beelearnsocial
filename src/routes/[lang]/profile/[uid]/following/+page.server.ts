import { prisma } from '$lib/prisma'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const user = await prisma.user.findFirst({
		where: {
			uid: params.uid,
		},
		select: {
			following: true,
		},
	})
	if (!user) {
		throw error(404, 'User not found')
	}
	return {
		users: user?.following,
	}
}
