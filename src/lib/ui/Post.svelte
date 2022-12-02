<script lang="ts">
	import type { Post, Tag, User } from '@prisma/client'
	import { locale, LL } from '$i18n/i18n-svelte'
	import dayjs from 'dayjs'
	import Hashtag from '$components/Hashtag.svelte'
	import PostMedia from '$components/PostMedia.svelte'
	import Exercise from '$components/Exercise.svelte'
	import PostInteractive from '$components/PostInteractive.svelte'
	import PostAction from '$components/PostAction.svelte'
	import { getUserId } from '$utils/client'
	import { showLoginModal, user } from '$stores/auth'
	import AddCollection from '$components/AddCollection.svelte'

	export let post: Post & {
		repeating: boolean
		author: User
		reactions: {
			userId: string
		}[]
		tags: Tag[]
	}
	export let showComments = false

	let showReportModal = false
	let addToCollection = false
</script>

<div class="mx-auto mb-4 px-4 py-6 overflow-hidden card shadow-md bg-base-100">
	<div class="flex place-content-between">
		<div>
			<div class="flex flex-row items-center w-full pb-4">
				<div class="w-12 h-12 rounded-full">
					<a href="/{$locale}/profile/{post.author.uid}">
						<img
							class="object-cover w-12 h-12 rounded-full"
							alt="User avatar"
							src={post.author.photoURL}
						/>
					</a>
				</div>
				<div class="flex flex-col ml-2 break-all">
					<a href="/{$locale}/profile/{post.author.uid}" class="hover:underline">
						<div class="text-sm font-semibold">
							{post.author.displayName}
						</div>
					</a>
					<div class="flex w-full mt-1">
						{dayjs(post.createdAt).fromNow()}
					</div>
				</div>
			</div>
		</div>

		<div class="dropdown dropdown-end">
			<label tabindex="0" class="p-1 font-bold text-lg">&vellip;</label>
			<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box gap-1">
				<li>
					<button on:click={() => (addToCollection = true)} class="link-success">
						{$LL.save()}
					</button>
				</li>
				{#if post.authorId !== getUserId()}
					<button
						for={`report-${post.id}`}
						on:click={() => {
							if (!$user) $showLoginModal = true
							else showReportModal = true
						}}
						class="btn btn-outline btn-warning"
					>
						{$LL.report()}
					</button>
				{/if}
				<PostAction action="hide" postId={post.id} label={$LL.hide} />
				<!-- {#if post.authorId === getUserId()}
					<PostAction action="delete" postId={post.id} label={$LL.delete} />
				{/if} -->
			</ul>
		</div>
	</div>
	{#if addToCollection}
		<AddCollection postId={post.id} destroy={() => (addToCollection = false)} />
	{/if}

	<div class="mb-2">
		{#each post.tags as tag}
			<Hashtag {tag} />
		{/each}
	</div>

	<p
		class:text-center={!post.options.length}
		class="mb-2 text-lg font-bold leading-6 line-clamp-2 font-montserrat"
	>
		{post.title}
	</p>

	<PostMedia audios={post.audios} videos={post.videos} images={post.images} />

	<Exercise {post} />

	<PostInteractive
		postId={post.id}
		reactions={post.reactions}
		{showComments}
		repeating={post.repeating}
	/>

	{#if showReportModal}
		<input
			type="checkbox"
			id={`report-${post.id}`}
			class="modal-toggle"
			bind:checked={showReportModal}
		/>
		<div class="modal">
			<div class="modal-box relative">
				<label for={`report-${post.id}`} class="btn btn-sm btn-circle absolute right-2 top-2">
					✕
				</label>
				<h3 class="text-lg font-bold">{$LL.report()}</h3>
				<p class="py-4">
					{$LL.theReasonYouWantToReportThisPost()}
				</p>
				<form action="/api/report?/create">
					<input type="hidden" name="postId" value={post.id} />
				</form>
			</div>
		</div>
	{/if}
</div>
