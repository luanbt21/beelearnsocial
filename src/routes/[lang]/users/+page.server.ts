import type { Actions, PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { followUser, getUsers, unfollowUser } from '$lib/db/user'

export const load: PageServerLoad = async () => {
	return {
		users: await getUsers(),
	}
}

const verifyId = async ({ locals, request }: { locals: App.Locals; request: Request }) => {
	if (!locals.user) {
		throw redirect(307, `/${locals.locale}/login`)
	}
	const data = await request.formData()
	const userId = <string>data.get('userId')
	return {
		id: locals.user.id,
		userId,
	}
}

export const actions: Actions = {
	follow: async ({ locals, request }) => {
		const params = await verifyId({ locals, request })
		return await followUser(params)
	},
	unfollow: async ({ locals, request }) => {
		const params = await verifyId({ locals, request })
		return await unfollowUser(params)
	},
}
