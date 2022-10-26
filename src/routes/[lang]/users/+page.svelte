<script lang="ts">
	import { fade } from 'svelte/transition'
	import type { PageData } from './$types'
	import { locale, LL } from '$i18n/i18n-svelte'
	import { enhance } from '$app/forms'
	import { getUserId } from '$utils'

	export let data: PageData
</script>

<div in:fade class="p-2 grid grid-cols-2 2xl:grid-cols-3 gap-2">
	{#each data.users as user (user.id)}
		{#if user.id !== getUserId()}
			<div
				class="card card-compact shadow-xl text-center transition duration-200 transform border border-transparent hover:border-current"
			>
				<a href={`/${$locale}/profile/${user.uid}`}>
					<figure class="pt-10">
						<div class="avatar">
							<div class="w-24 rounded-full">
								<img src={user.photoURL} alt="user avatar" class="rounded-xl w-full" />
							</div>
						</div>
					</figure>
				</a>
				<div class="card-body items-center text-center">
					<a href={`/${$locale}/profile/${user.uid}`} class="link link-hover">
						<h2 class="card-title">{user.displayName}</h2>
					</a>
					{#if user.introduction}
						<p>{user.introduction}</p>
					{/if}
					<p>{user.followedByIDs.length} {$LL.follower()}</p>
					<div class="card-actions">
						{#if user.followedByIDs.includes(getUserId() ?? '')}
							<form method="POST" action="?/unfollow" use:enhance>
								<input type="hidden" name="userId" value={user.id} />
								<button class="btn btn-primary">{$LL.unfollow()}</button>
							</form>
						{:else}
							<form method="POST" action="?/follow" use:enhance>
								<input type="hidden" name="userId" value={user.id} />
								<button class="btn btn-primary">{$LL.follow()}</button>
							</form>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	{/each}
</div>
