<script lang="ts">
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
			history.pushState(
				{ locale: newLocale },
				'',
				replaceLocaleInUrl(location.pathname + location.search, newLocale),
			)
		}
	}

	const handlePopStateEvent = async ({ state }: PopStateEvent) => switchLocale(state.locale, false)
</script>

<svelte:window on:popstate={handlePopStateEvent} />

<div class="dropdown">
	<button tabindex="0" class="btn btn-square btn-ghost m-1">{$locale}</button>
	<ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box">
		{#each locales as l}
			<li>
				<button class:active={l === $locale} on:click={() => switchLocale(l)}>
					{l}
				</button>
			</li>
		{/each}
	</ul>
</div>
