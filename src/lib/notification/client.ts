import { PUBLIC_VAPID_KEY } from '$env/static/public'
import { dev } from '$app/environment'

export async function registerServiceWorker() {
	const registration = await navigator.serviceWorker.register('/service-worker.js', {
		type: dev ? 'module' : 'classic',
	})
	if (await registration.pushManager.getSubscription()) return
	const subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlB64ToUint8Array(PUBLIC_VAPID_KEY),
	})
	await fetch('/api/notification', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(subscription),
	})
}

const urlB64ToUint8Array = (base64String: string) => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
	const rawData = window.atob(base64)
	const outputArray = new Uint8Array(rawData.length)
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i)
	}
	return outputArray
}
