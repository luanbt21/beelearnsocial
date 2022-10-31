<script lang="ts">
	import { onMount } from 'svelte'
	import PostComment from './PostComment.svelte'
	import PocketBase from 'pocketbase'
	import { user } from '$stores/auth'
	import { locale } from '$i18n/i18n-svelte'

	export let postId: string
	let comments: Comment[] = []
	const client = new PocketBase('https://pocket.luanbt.live')

	onMount(async () => {
		comments = await client.records.getFullList('comment', 200, {
			filter: `postId = "${postId}"`,
		})
	})
</script>

{#if $user}
	<div class="flex flex-row mt-5">
		<div class="avatar">
			<div class="w-11 rounded-full">
				<img src={$user.photoURL} alt="user avatar" />
			</div>
		</div>
		<div class="ml-3">
			<input type="text" placeholder="Type here" class="input input-bordered w-full" />
		</div>
	</div>
{/if}

{#each comments as comment}
	<PostComment {comment} />
{/each}
