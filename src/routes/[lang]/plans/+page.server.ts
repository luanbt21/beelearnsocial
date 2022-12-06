import type { Actions, PageServerLoad } from './$types'
import { prisma } from '$lib/prisma'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return

	return {
		todoList: await getPlans({ userId: locals.user.id, status: false }),
		completedTodoList: await getPlans({ userId: locals.user.id, status: true }),
	}
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) throw error(404)

		const data = await request.formData()
		const description = data.get('description') as string
		if (!description) throw error(400, 'description is empty')

		const due = data.get('due') as string

		await prisma.plan.create({
			data: {
				userId: locals.user.id,
				description,
				due: due ? new Date(due) : undefined,
				priority: Number(data.get('priority')) || undefined,
			},
		})
	},
	update: async ({ request, locals }) => {
		if (!locals.user) throw error(404)
		const data = await request.formData()

		const description = data.get('description') as string
		if (!description) throw error(400, 'description is empty')

		const status = data.get('status') === 'true'
		await prisma.plan.update({
			where: { id: data.get('id') as string },
			data: {
				description,
				status,
			},
		})
	},
}

const getPlans = async ({ userId, status }: { userId: string; status: boolean }) => {
	return prisma.plan.findMany({
		where: {
			userId,
			status,
		},
		orderBy: {
			updatedAt: 'desc',
		},
	})
}
