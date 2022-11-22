<script lang="ts">
	import { goto } from '$app/navigation'
	import { user, authLoading, showLoginModal } from '$stores/auth'
	import { locale } from '$i18n/i18n-svelte'

	$: if (!$authLoading) {
		$showLoginModal = true
	}

	$: if (!$showLoginModal) {
		goto(`/${$locale}/explore`)
	}

	$: if ($user) {
		goto(`/${$locale}/profile/${$user.uid}`)
	}
</script>

{#if $authLoading}
	<button class="btn btn-ghost loading" />
{/if}
