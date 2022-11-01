<script lang="ts">
	import { onMount } from 'svelte'
	import PostComment from './PostComment.svelte'
	import PocketBase from 'pocketbase'
	import { user } from '$stores/auth'
	import { getUserId } from '$utils'
	import Tiptap from './Tiptap.svelte'

	export let postId: string
	export let length = 0
	let comments: Comment[] = []
	let value = ''
	const client = new PocketBase('https://pocket.luanbt.live')

	const sentComment = async () => {
		client.records.create('comment', {
			postId,
			userId: getUserId(),
			content: value,
		})
	}

	onMount(async () => {
		// @ts-ignore
		comments = await client.records.getFullList('comment', 200, {
			filter: `postId = "${postId}"`,
		})
		length = comments.length
	})
</script>

{#if $user}
	<div class="flex items-start mt-5">
		<div class="avatar">
			<div class="w-11 rounded-full">
				<img src={$user.photoURL} alt="user avatar" />
			</div>
		</div>

		<div class="ml-3 w-full border-b">
			<div class="form-control">
				<div class="flex items-end">
					<div class="w-full">
						<Tiptap bind:value />
					</div>
					<button
						class="btn btn-square btn-sm lg:btn-md btn-secondary ml-2"
						on:click={sentComment}
						disabled={!value}
					>
						<img class="w-3/4" src="/sent-icon.svg" alt="sent" />
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#each comments as comment}
	<PostComment {comment} />
{/each}
