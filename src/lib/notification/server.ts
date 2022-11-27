import webpush from 'web-push'
import { PRIVATE_VAPID_KEY, VAPID_SUBJECT } from '$env/static/private'
import { PUBLIC_VAPID_KEY } from '$env/static/public'
import { prisma } from '$lib/prisma'
import type { RecordSubscription } from 'pocketbase'
import type { IComment } from 'src/global'
import type { i18n } from '$i18n/i18n-util'
import { logoPath } from '$lib/constant'

export async function notificationOnComment(
	data: RecordSubscription<IComment>,
	L: ReturnType<typeof i18n>,
) {
	const post = await prisma.post.findFirst({
		where: {
			id: data.record.postId,
		},
		select: {
			title: true,
			author: {
				select: {
					id: true,
					pushSubscriptions: true,
					locale: true,
				},
			},
		},
	})

	// ignore if commenter and the post author are the same person
	if (data.record.userId === post?.author.id) return

	const commenter = await prisma.user.findFirst({
		where: {
			id: data.record.userId,
		},
		select: {
			displayName: true,
		},
	})

	if (!commenter || !post) return

	const locale: Locales = post.author.locale ? post.author.locale : 'en'
	const LL = L[locale]

	sendNotifications({
		subscriptions: post.author.pushSubscriptions,
		title: `${commenter?.displayName} ${LL.haveCommentedOnYourPost()}`,
		options: { body: `${LL.postTitle()}: ${post.title}`, lang: locale },
	})
}

const vapidDetails = {
	publicKey: PUBLIC_VAPID_KEY,
	privateKey: PRIVATE_VAPID_KEY,
	subject: VAPID_SUBJECT,
}

export async function sendNotifications({
	subscriptions,
	title,
	options = { icon: logoPath },
}: {
	subscriptions: webpush.PushSubscription[]
	title: string
	options?: NotificationOptions
}) {
	options.icon = options.icon ? options.icon : logoPath
	const notification = JSON.stringify({
		title,
		options,
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
			locale: true,
			displayName: true,
			pushSubscriptions: true,
		},
	})
	await Promise.all(
		users.map(async (user) => {
			return await sendNotifications({
				subscriptions: user.pushSubscriptions,
				title,
				options: { body, lang: user.locale || 'en' },
			})
		}),
	).catch((e) => {
		console.log(new Date(), e)
	})
}
