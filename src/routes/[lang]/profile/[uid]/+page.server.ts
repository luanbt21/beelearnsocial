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

	const levels = await prisma.learnLevel.groupBy({
		by: ['level'],
		where: { userId: user.id },
		_count: { _all: true },
		orderBy: { level: 'asc' },
	})

	return { user, levels }
}
