/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope
declare const clients: Clients

self.addEventListener('push', (event) => {
	if (event.data) {
		const notification = event.data.json()
		self.registration.showNotification(notification.title, notification.options)
	}
})

self.addEventListener(
	'notificationclick',
	function (event) {
		event.notification.close()
		const data = event.notification.data
		event.waitUntil(
			clients
				.matchAll({
					type: 'window',
				})
				.then(function (clientList) {
					const locale = event.notification.lang || 'en'
					for (let i = 0; i < clientList.length; i++) {
						const client = clientList[i]
						if (data && data.postId) {
							if (client.url.includes(event.notification.data.postId)) {
								return client.focus()
							}
						} else if (client.url.startsWith(self.registration.scope)) {
							return client.focus()
						}
					}
					if (data && data.postId) {
						return clients.openWindow(
							`/${locale}/explore/post?id=${event.notification.data.postId}`,
						)
					}
					if (clients.openWindow) {
						return clients.openWindow(`/${locale}/feed`)
					}
				}),
		)
	},
	false,
)

export {}
