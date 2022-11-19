import webpush from 'web-push'
import { PRIVATE_VAPID_KEY, VAPID_SUBJECT } from '$env/static/private'
import { PUBLIC_VAPID_KEY } from '$env/static/public'
import { prisma } from '$lib/prisma'

const vapidDetails = {
	publicKey: PUBLIC_VAPID_KEY,
	privateKey: PRIVATE_VAPID_KEY,
	subject: VAPID_SUBJECT,
}

export async function sendNotifications({
	subscriptions,
	title,
	body,
}: {
	subscriptions: webpush.PushSubscription[]
	title: string
	body: string
}) {
	const notification = JSON.stringify({
		title,
		options: {
			body,
		},
	})
	await Promise.all(
		subscriptions.map(async (subscription) => {
			await webpush.sendNotification(subscription, notification, {
				TTL: 7 * 86400,
				vapidDetails: vapidDetails,
			})
		}),
	).catch((e) => console.log(e))
}

export async function notificationAll({ title, body }: { title: string; body: string }) {
	const users = await prisma.user.findMany({
		select: {
			displayName: true,
			pushSubscriptions: true,
		},
	})
	await Promise.all(
		users.map(async (user) => {
			return await sendNotifications({
				subscriptions: user.pushSubscriptions,
				title,
				body,
			})
		}),
	).catch((e) => {
		console.log(new Date().toISOString(), e)
	})
}
