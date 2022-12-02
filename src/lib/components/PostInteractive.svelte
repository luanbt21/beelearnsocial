<script lang="ts">
	import { LL } from '$i18n/i18n-svelte'
	import Svg from '$components/Svg.svelte'
	import { locale } from '$i18n/i18n-svelte'
	import { toast } from '@zerodevx/svelte-toast'
	import PostComments from './PostComments.svelte'
	import { appPost, getUserId } from '$utils/client'
	import { enhance } from '$app/forms'
	import { user, showLoginModal } from '$stores/auth'

	export let postId: string
	export let reactions: {
		userId: string
	}[] = []
	export let showComments = false
	export let repeating: boolean

	let commentCount: number
	let isSending = false

	$: isLiked = $user ? reactions.some(({ userId }) => userId === getUserId()) : false

	const repeatPost = async (e: MouseEvent) => {
		if (!$user) {
			$showLoginModal = true
			return
		}
		const btn = e.target as HTMLButtonElement
		try {
			btn.disabled = true
			btn.classList.add('loading')
			const res = await appPost(`/api/post/repeat`, { postId })
			if (res.ok) {
				btn.classList.add('hidden')
			} else if (res.status === 401) {
				$showLoginModal = true
			}
		} finally {
			btn.disabled = false
			btn.classList.remove('loading')
		}
	}
</script>

<div class="mt-4 pt-4 border-t">
	<div class="flex justify-between items-center">
		<div class="flex">
			<form
				method="POST"
				action={isLiked ? `/${$locale}/post?/dislike` : `/${$locale}/post?/like`}
				use:enhance={({ cancel }) => {
					if (!$user) {
						$showLoginModal = true
						cancel()
						return
					}
					isSending = true
					return async ({ update }) => {
						await update()
						isSending = false
					}
				}}
			>
				<input type="hidden" name="postId" value={postId} />
				<button class="btn btn-sm btn-ghost" class:loading={isSending} disabled={isSending}>
					{#if isLiked}
						<Svg name="red-love" />
					{:else}
						<Svg name="love" />
					{/if}
					<span class="ml-1">{reactions.length}</span>
				</button>
			</form>

			<button class="btn btn-sm btn-ghost" on:click={() => (showComments = !showComments)}>
				<Svg name="comment" />
				{#if commentCount}
					<span class="ml-1">{commentCount}</span>
				{/if}
			</button>
			<button
				class="btn btn-sm btn-ghost"
				on:click={() => {
					navigator.clipboard.writeText(`${location.host}/${$locale}/explore/post?id=${postId}`)
					toast.push($LL.linkCopied())
				}}
			>
				<Svg name="link" width={16} height={16} />
			</button>
		</div>

		{#if !repeating}
			<div>
				<button on:click={repeatPost} class="btn btn-primary btn-sm lg:btn-md">
					{$LL.repeat()}
				</button>
			</div>
		{/if}
	</div>
	{#if showComments}
		<div class="px-2">
			<PostComments {postId} bind:length={commentCount} />
		</div>
	{/if}
</div>
