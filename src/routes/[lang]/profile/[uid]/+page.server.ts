import type { Actions, PageServerLoad } from './$types'
import { prisma } from '$lib/prisma'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
	const user = await prisma.user.findFirst({
		where: { uid: params.uid },
		include: { collections: true },
	})
	if (!user) throw error(404, 'User not found')

	const levels = prisma.learnLevel.groupBy({
		by: ['level'],
		where: { userId: user.id },
		_count: { _all: true },
		orderBy: { level: 'asc' },
	})

	return { user, levels }
}

export const actions: Actions = {
	update: async ({ locals, request, params }) => {
		if (!locals.user) throw error(401)
		if (locals.user.uid !== params.uid) throw error(403)

		const data = await request.formData()
		const introduction = (data.get('introduction') as string) || undefined
		const coverImageURL = (data.get('coverImageURL') as string) || undefined

		return await prisma.user.update({
			where: { id: locals.user.id },
			data: { introduction, coverImageURL },
		})
	},
}
