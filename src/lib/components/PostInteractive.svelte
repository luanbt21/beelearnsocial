<script lang="ts">
	import type { Post } from '@prisma/client'
	import { LL } from '$i18n/i18n-svelte'
	import Svg from '$components/Svg.svelte'
	import { locale } from '$i18n/i18n-svelte'
	import { toast } from '@zerodevx/svelte-toast'
	import PostComments from './PostComments.svelte'

	export let post: Post
	export let showComments = false

	let commentCount: number

	const width = 20
	const height = 20
</script>

<div class="mt-4 pt-4 border-t">
	<div class="flex flex-row justify-between items-center">
		<div>
			<button class="btn btn-sm btn-ghost">
				<Svg name="love" {width} {height} />
				<span class="ml-1">20</span>
			</button>
			<button class="btn btn-sm btn-ghost" on:click={() => (showComments = !showComments)}>
				<Svg name="comment" {width} {height} />
				{#if commentCount}
					<span class="ml-1">{commentCount}</span>
				{/if}
			</button>
			<button
				class="btn btn-sm btn-ghost"
				on:click={() => {
					navigator.clipboard.writeText(`${location.host}/${$locale}/explore/post?id=${post.id}`)
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
			<PostComments postId={post.id} bind:length={commentCount} />
		</div>
	{/if}
</div>
