<script lang="ts">
	import type { Post, Reaction, Tag, User } from '@prisma/client'
	import { locale } from '$i18n/i18n-svelte'
	import { fade } from 'svelte/transition'
	import dayjs from 'dayjs'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import Hashtag from '$components/Hashtag.svelte'
	import PostBody from '$components/PostBody.svelte'

	dayjs.extend(relativeTime)

	export let post: Post & {
		author: User
		tags: Tag[]
		reactions: Reaction[]
	}
</script>

<div in:fade>
	<div class="flex max-w-xl mx-auto mb-4 px-4 py-6 overflow-hidden card shadow-md">
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
				<div class=" mb-2 text-lg font-bold leading-6 text-gray-800 line-clamp-2 font-montserrat">
					{post.title}
				</div>
				<div
					class=" mb-2 text-s
          m text-gray-700 break-all line-clamp-5 font-karla"
				>
					{post.description || ''}
				</div>
				<PostBody props={post} />

				<!-- <div class="flex justify-start mt-4">
          <div class="flex gap-4 px-2">
            <button title="loves" on:click="{() => lovePost(post._id)}" class="{mediaButtonClass}">
              {#if post.isLovedByMe}
                <Svg name="red-love" height="16" width="16" />
              {:else}
                <Svg name="love" height="16" width="16" />
              {/if}
              <span>{post.loveCount}</span>
            </button>
            <a href="#/post/{post._id}" title="comments" class="{mediaButtonClass}">
              <Svg name="comment" height="16" width="16" />
              <span>{post.commentCount}</span>
            </a>
            {#if post.author == $loggedUsername}
              <button title="delete" on:click="{onDelete}" class="{mediaButtonClass}">
                <Svg name="delete" height="16" width="16" />
              </button>
            {/if}
            <button title="bookmark" on:click="{() => bookmarkPost(post._id)}" class="{mediaButtonClass}">
              <Svg name="bookmark" height="16" width="16" />
            </button>
            <a title="visit link" href="{post.url}" target="_blank" class="{mediaButtonClass}">
              <Svg name="external" height="16" width="16" />
            </a>
          </div>
        </div> -->
			</div>
		</div>
	</div>
</div>
