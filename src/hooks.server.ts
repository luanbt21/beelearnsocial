import type { Locales } from '$i18n/i18n-types'
import { detectLocale, i18n, isLocale } from '$i18n/i18n-util'
import { loadAllLocales } from '$i18n/i18n-util.sync'
import type { Handle, RequestEvent } from '@sveltejs/kit'
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors'
import { admin } from '$lib/firebase'

loadAllLocales()
const L = i18n()

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token')
	if (token) {
		const user = await admin
			.auth()
			.verifyIdToken(token)
			.catch(() => {
				event.cookies.delete('token')
			})
		event.locals.uid = user?.uid ?? ''
	}

	const [, lang] = event.url.pathname.split('/')

	if (!lang || !isLocale(lang)) {
		const locale = getPreferredLocale(event)

		return new Response(null, {
			status: 302,
			headers: { Location: `/${locale}` },
		})
	}

	const locale = lang as Locales
	const LL = L[locale]

	event.locals.locale = locale
	event.locals.LL = LL

	return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', lang) })
}

const getPreferredLocale = ({ request }: RequestEvent) => {
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request)
	return detectLocale(acceptLanguageDetector)
}
