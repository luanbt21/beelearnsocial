import type { RequestHandler } from './$types'
import { prisma } from '$lib/prisma'
import { sendNotifications } from '$lib/notification/server'
import { error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url }) => {
	const email = url.searchParams.get('email') || 'luan.vy.yb@gmail.com'
	const user = await prisma.user.findFirst({
		where: {
			email,
		},
		select: {
			locale: true,
			pushSubscriptions: true,
			posts: {
				take: 1,
				select: {
					id: true,
				},
			},
		},
	})
	if (!user) throw error(500)
	sendNotifications({
		subscriptions: user?.pushSubscriptions,
		title: 'Hello',
		options: {
			data: { postId: user.posts[0].id },
			lang: user.locale || 'en',
		},
	})
	return new Response()
}
