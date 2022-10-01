import { detectLocale } from '$i18n/i18n-util'
import type { Handle, RequestEvent } from '@sveltejs/kit'
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors'

export const handle: Handle = async ({ event, resolve }) => {
	const [, lang] = event.url.pathname.split('/')

	if (!lang) {
		const locale = getPreferredLocale(event)

		return new Response(null, {
			status: 302,
			headers: { Location: `/${locale}` },
		})
	}

	return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', lang) })
}

const getPreferredLocale = ({ request }: RequestEvent) => {
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request)
	return detectLocale(acceptLanguageDetector)
}
