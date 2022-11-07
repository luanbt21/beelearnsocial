import type { LayoutLoad } from './$types'
import { loadLocaleAsync } from '$i18n/i18n-util.async'
import { setLocale } from '$i18n/i18n-svelte'

export const load: LayoutLoad = async ({ data }) => {
	await loadLocaleAsync(data.locale)
	setLocale(data.locale)
	return data
}
