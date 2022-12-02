<script lang="ts">
	import { fade } from 'svelte/transition'
	import type { PageData } from './$types'
	import { getUserId } from '$utils/client'
	import UserCard from '$ui/UserCard.svelte'
	import LL from '$i18n/i18n-svelte'
	import { user } from '$stores/auth'

	export let data: PageData
</script>

<svelte:head>
	<title>{$user?.displayName} {$LL.following()}</title>
</svelte:head>
<div in:fade class="p-2 grid grid-cols-2 2xl:grid-cols-3 gap-2">
	{#each data.users as user (user.id)}
		{#if user.id !== getUserId()}
			<UserCard {user} />
		{/if}
	{/each}
</div>
