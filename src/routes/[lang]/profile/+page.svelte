<script lang="ts">
	import { goto } from '$app/navigation'
	import { user, authLoading, showLoginModal } from '$stores/auth'
	import { locale } from '$i18n/i18n-svelte'
	import { browser } from '$app/environment'
	import type { User } from 'firebase/auth'

	$: if (!$authLoading) {
		$showLoginModal = true
	}

	const handleHideLoginModal = (showLoginModal: boolean) => {
		if (!showLoginModal && browser) {
			goto(`/${$locale}/explore`)
		}
	}
	$: handleHideLoginModal($showLoginModal)

	const handleRedirect = (user: User | null) => {
		if (user) {
			goto(`/${$locale}/profile/${user.uid}`)
		}
	}
	$: handleRedirect($user)
</script>

{#if $authLoading}
	<button class="btn btn-ghost loading" />
{/if}
