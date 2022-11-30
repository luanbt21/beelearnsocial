<script lang="ts">
	import { goto } from '$app/navigation'
	import { user, authLoading, showLoginModal } from '$stores/auth'
	import { locale } from '$i18n/i18n-svelte'
	import type { User } from 'firebase/auth'
	import { handleHideLoginModal } from '$utils'

	$: if (!$authLoading) {
		$showLoginModal = true
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
