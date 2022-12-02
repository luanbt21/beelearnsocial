<script lang="ts">
	import type { User } from '@prisma/client'
	import { locale, LL } from '$i18n/i18n-svelte'
	import { enhance } from '$app/forms'
	import { getUserId } from '$utils/client'
	import { showLoginModal, user as userStore } from '$stores/auth'

	export let user: User
	let isSending = false
</script>

<div
	class="card card-compact shadow-xl text-center transition duration-200 transform border border-transparent hover:border-current bg-base-100"
>
	<a href="/{$locale}/profile/{user.uid}">
		<figure class="pt-10">
			<div class="avatar">
				<div class="w-24 rounded-full">
					<img src={user.photoURL} alt="user avatar" class="rounded-xl w-full" />
				</div>
			</div>
		</figure>
	</a>
	<div class="card-body items-center text-center">
		<a href="/{$locale}/profile/{user.uid}" class="link link-hover">
			<h2 class="card-title">{user.displayName}</h2>
		</a>
		{#if user.introduction}
			<p>{user.introduction}</p>
		{/if}
		<p>{$LL.nFollowers({ nrOfFollowers: user.followedByIDs.length })}</p>
		<div class="card-actions">
			<form
				method="POST"
				use:enhance={({ cancel }) => {
					if (!$userStore) {
						cancel()
						$showLoginModal = true
						return
					}
					isSending = true
					return async ({ update }) => {
						await update()
						isSending = false
					}
				}}
			>
				<input type="hidden" name="userId" value={user.id} />
				{#if user.followedByIDs.includes(getUserId() ?? '')}
					<button
						formaction={`${$locale}/users?/unfollow`}
						disabled={isSending}
						class:loading={isSending}
						class="btn btn-primary"
					>
						{$LL.unfollow()}
					</button>
				{:else}
					<button
						formaction={`${$locale}/users?/follow`}
						disabled={isSending}
						class:loading={isSending}
						class="btn btn-primary"
					>
						{$LL.follow()}
					</button>
				{/if}
			</form>
		</div>
	</div>
</div>
