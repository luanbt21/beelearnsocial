import type { RequestHandler } from './$types'
import { prisma } from '$lib/prisma'
import { error } from '@sveltejs/kit'
import { sendNotifications } from '$lib/notification/server'

export const POST: RequestHandler = async ({ locals, request }) => {
	const user = locals.user
	if (!user) throw error(401)
	const subscription = await request.json()
	if (!user.pushSubscriptions.some((p) => p.endpoint === subscription.endpoint)) {
		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				pushSubscriptions: {
					push: subscription,
				},
			},
		})
	}
	sendNotifications({
		subscriptions: [subscription],
		title: locals.LL.congratulation(),
		options: {
			body: `${locals.LL.welcome()} ${user.displayName} ${locals.LL.to()} Bee learn social!`,
			lang: user.locale || 'en',
		},
	})
	return new Response()
}
