import { detectLocale } from '$i18n/i18n-util';
import type { GetSession, Handle, RequestEvent } from '@sveltejs/kit';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';

const htmlLanguageAttributeReplacer =
	(locale: string) =>
	({ html }: { html: string }) =>
		html.replace('<html lang="en">', `<html lang="${locale}">`);

export const handle: Handle = async ({ event, resolve }) => {
	const [, lang] = event.url.pathname.split('/');

	return resolve(event, { transformPageChunk: htmlLanguageAttributeReplacer(lang) });
};

export const getSession: GetSession = (event) => {
	const headers = getHeaders(event);
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector({ headers });
	const locale = detectLocale(acceptLanguageDetector);

	return {
		locale
	};
};

const getHeaders = (event: RequestEvent) => {
	const headers: Record<string, string> = {};
	event.request.headers.forEach((value, key) => (headers[key] = value));

	return headers;
};
