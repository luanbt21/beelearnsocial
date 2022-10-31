<script lang="ts">
	import { onMount } from 'svelte'
	import { locale } from '$i18n/i18n-svelte'
	import type { User } from '@prisma/client'

	export let comment: Comment

	let user: User

	onMount(async () => {
		const res = await fetch(`/${$locale}/users/${comment.userId}`)
		user = await res.json()
	})
</script>

{#if user}
	<div class="flex flex-row mt-5">
		<div class="avatar">
			<div class="w-11 rounded-full">
				<img src={user.photoURL} alt="user avatar" />
			</div>
		</div>
		<div class="ml-3">
			<div>
				<a class="link link-hover" href={`${$locale}/profile/${user.uid}`}>{user.displayName}</a>
			</div>
			<p>{comment.content}</p>
		</div>
	</div>
{/if}
