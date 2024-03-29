import type { Locales } from '$i18n/i18n-types'
import { detectLocale, i18n, isLocale } from '$i18n/i18n-util'
import { loadAllLocales } from '$i18n/i18n-util.sync'
import type { Handle, RequestEvent } from '@sveltejs/kit'
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { saveUser } from '$lib/db/user'
import { FIREBASE_SERVICE_ACCOUNT_KEY } from '$env/static/private'
import dayjs from 'dayjs'
import EventSource from 'eventsource'
import { notificationOnComment } from '$lib/notification/server'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.EventSource = EventSource

loadAllLocales()
const L = i18n()

if (!getApps().length) {
	const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY)
	const app = initializeApp({
		credential: cert(serviceAccount),
	})
	const db = getFirestore(app)
	db.collection('comment').onSnapshot((snapshot) => {
		snapshot.docChanges().forEach((change) => {
			notificationOnComment(change, L)
		})
	})
}

export const handle: Handle = async ({ event, resolve }) => {
	const [, lang, ...path] = event.url.pathname.split('/')
	const bypassPaths = ['api', 'favicon2.png', 'service-worker.js']

	if (!isLocale(lang) && !bypassPaths.includes(lang)) {
		const locale = getPreferredLocale(event)
		return new Response(null, {
			status: 302,
			headers: { Location: `/${locale}/${path}` },
		})
	}

	const locale = isLocale(lang) ? (lang as Locales) : getPreferredLocale(event)

	const token = event.cookies.get('token')
	if (token) {
		const user = await getAuth()
			.verifyIdToken(token)
			.catch(() => {
				event.cookies.delete('token', { path: '/' })
				event.cookies.delete('userId', { path: '/' })
			})
		event.locals.user = await saveUser(user, locale)
	}

	const LL = L[locale]
	event.locals.locale = locale
	event.locals.LL = LL

	switch (locale) {
		case 'vi':
			dayjs.locale('vi')
			break
		default:
			dayjs.locale('en')
			break
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang),
	})
	if (event.locals.user) {
		response.headers.append('Set-Cookie', `userId=${event.locals.user.id}; path=/`)
	}

	return response
}

const getPreferredLocale = ({ request }: RequestEvent) => {
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request)
	return detectLocale(acceptLanguageDetector)
}
