import type { Locales } from '$i18n/i18n-types'
import { detectLocale, i18n, isLocale } from '$i18n/i18n-util'
import { loadAllLocales } from '$i18n/i18n-util.sync'
import type { Handle, RequestEvent } from '@sveltejs/kit'
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { saveUser } from '$lib/db/user'
import { FIREBASE_SERVICE_ACCOUNT_KEY } from '$env/static/private'
import dayjs from 'dayjs'
import EventSource from 'eventsource'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.EventSource = EventSource

if (!getApps().length) {
	const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY)
	initializeApp({
		credential: cert(serviceAccount),
	})
}

loadAllLocales()
const L = i18n()

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token')
	if (token) {
		const user = await getAuth()
			.verifyIdToken(token)
			.catch(() => {
				event.cookies.delete('token')
				event.cookies.delete('userId')
			})
		event.locals.user = await saveUser(user)
	}

	const [, lang, ...path] = event.url.pathname.split('/')
	const bypassPaths = ['api', 'favicon.png', 'service-worker.js']

	if (!isLocale(lang) && !bypassPaths.includes(lang)) {
		const locale = getPreferredLocale(event)
		return new Response(null, {
			status: 302,
			headers: { Location: `/${locale}/${path}` },
		})
	}

	const locale = isLocale(lang) ? (lang as Locales) : getPreferredLocale(event)

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
