<script lang="ts">
	import { onMount } from 'svelte'
	import PostComment from './PostComment.svelte'
	import { user } from '$stores/auth'
	import { getUserId } from '$utils'
	import Tiptap from './Tiptap.svelte'
	import type { Record } from 'pocketbase'
	import { pocket } from '$stores'

	export let postId: string
	export let length = 0
	let comments: Record[] = []
	$: length = comments.length

	let value = ''

	$pocket.realtime.subscribe('comment', (e) => {
		if (e.record.postId !== postId) return
		switch (e.action) {
			case 'create':
				comments = [...comments, e.record]
				break
			case 'update':
				comments = comments.map((r) => {
					if (r.id === e.record.id) {
						return e.record
					}
					return r
				})
				break
			case 'delete':
				comments = comments.filter((r) => r.id !== e.record.id)
				break

			default:
				break
		}
	})

	const sentComment = async () => {
		$pocket.records.create('comment', {
			postId,
			userId: getUserId(),
			content: value,
		})
		value = ''
	}

	onMount(async () => {
		comments = await $pocket.records.getFullList('comment', 200, {
			filter: `postId = "${postId}"`,
		})
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