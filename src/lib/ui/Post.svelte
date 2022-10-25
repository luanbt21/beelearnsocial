<script lang="ts">
	import type { Post, Reaction, Tag, User } from '@prisma/client'
	import { locale } from '$i18n/i18n-svelte'
	import { fade } from 'svelte/transition'
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import Hashtag from '$components/Hashtag.svelte'
	import PostMedia from '$components/PostMedia.svelte'
	import Exercise from '$components/Exercise.svelte'
	import PostInteractive from '$components/PostInteractive.svelte'

	dayjs.extend(relativeTime)

	export let post: Post & {
		author: User
		tags: Tag[]
		reactions: Reaction[]
	}
</script>

<div in:fade class="flex mx-auto mb-4 px-4 py-6 overflow-hidden card shadow-md">
	<div class="flex items-center w-full">
		<div class="w-full">
			<div class="flex flex-row items-center w-full  pb-4">
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

			<div class=" mb-2">
				{#each post.tags as tag}
					<Hashtag {tag} />
				{/each}
			</div>

			<PostMedia {post} />

			<Exercise {post} />

			<PostInteractive {post} />
		</div>
	</div>
</div>
