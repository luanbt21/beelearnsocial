<script lang="ts">
	import { browser } from '$app/environment'
	import { page } from '$app/stores'
	import { setLocale, locale } from '$i18n/i18n-svelte'
	import type { Locales } from '$i18n/i18n-types'
	import { locales } from '$i18n/i18n-util'
	import { loadLocaleAsync } from '$i18n/i18n-util.async'
	import { replaceLocaleInUrl } from '$utils'

	const switchLocale = async (newLocale: Locales, updateHistoryState = true) => {
		if (!newLocale || $locale === newLocale) return
		await loadLocaleAsync(newLocale)
		setLocale(newLocale)
		document.querySelector('html')?.setAttribute('lang', newLocale)

		if (updateHistoryState) {
			// update url to reflect locale changes
			history.pushState({ locale: newLocale }, '', replaceLocaleInUrl(location.pathname, newLocale))
		}
	}

	// update locale when navigating via browser back/forward buttons
	const handlePopStateEvent = async ({ state }: PopStateEvent) => switchLocale(state.locale, false)

	// update locale when page store changes
	$: if (browser) {
		const lang = $page.params.lang as Locales
		switchLocale(lang, false)
		history.replaceState(
			{ ...history.state, locale: lang },
			'',
			replaceLocaleInUrl(location.pathname, lang),
		)
	}
</script>

<svelte:window on:popstate={handlePopStateEvent} />

<div class="dropdown dropdown-end">
	<label tabindex="0" class="btn m-1">{$locale}</label>
	<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-4">
		{#each locales as l}
			<li>
				<button class:active={l === $locale} on:click={() => switchLocale(l)}>
					{l}
				</button>
			</li>
		{/each}
	</ul>
</div>
