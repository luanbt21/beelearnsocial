<script lang="ts">
	import { LL } from '$i18n/i18n-svelte'
	import Svg from '$components/Svg.svelte'
	import { locale } from '$i18n/i18n-svelte'
	import { toast } from '@zerodevx/svelte-toast'
	import PostComments from './PostComments.svelte'
	import { getUserId } from '$utils'
	import { enhance } from '$app/forms'

	export let postId: string
	export let reactions: {
		userId: string
	}[] = []
	export let showComments = false

	let commentCount: number

	const handleForm = async (e: SubmitEvent) => {
		e.preventDefault()
		const form = e.target as HTMLFormElement
		const data = new FormData(form)
		const response = await fetch(form.action, {
			method: form.method,
			headers: {
				accept: 'application/json',
			},
			body: data,
		})
		if (response.ok) {
			if (form.action.includes('/dislike')) {
				reactions = reactions.filter(({ userId }) => userId !== getUserId())
			} else if (form.action.includes('/like') && getUserId()) {
				reactions = [...reactions, { userId: getUserId() || '' }]
			}
		}
	}
</script>

<div class="mt-4 pt-4 border-t">
	<div class="flex justify-between items-center">
		<div class="flex">
			{reactions.some(({ userId }) => userId === getUserId() ?? '')}
			<form
				method="POST"
				on:submit={handleForm}
				action={reactions.some(({ userId }) => userId === getUserId() ?? '')
					? `/${$locale}/post?/dislike`
					: `/${$locale}/post?/like`}
			>
				<input type="hidden" name="postId" value={postId} />
				<button class="btn btn-sm btn-ghost">
					<Svg name="love" />
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

		<div>
			<button class="btn btn-primary btn-sm lg:btn-md">{$LL.repeat()}</button>
		</div>
	</div>
	{#if showComments}
		<div class="px-2">
			<PostComments {postId} bind:length={commentCount} />
		</div>
	{/if}
</div>
