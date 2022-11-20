<script lang="ts">
	import type { Post, User } from '@prisma/client'
	import dayjs from 'dayjs'
	import { locale } from '$i18n/i18n-svelte'

	export let post: Post & { author: User }
</script>

<div class="card card-compact w-80 shadow">
	<a href={`/${$locale}/explore/post?id=${post.id}`}>
		<figure class="h-60 bg-base-200">
			{#if post.images.length}
				<img class="object-cover w-full h-full" src={post.images[0]} alt="post" />
			{:else if post.videos.length}
				<video>
					<source src={post.videos[0]} type="video/mp4" />
					<track kind="captions" />
				</video>
			{/if}
		</figure>
	</a>
	<div class="card-body">
		<a class="link link-hover" href={`/${$locale}/explore/post?id=${post.id}`}>
			<h2 class="card-title">{post.title}</h2>
		</a>
		<div class="mt-auto">
			<a class="link link-hover" href={`/${$locale}/profile/${post.author.uid}`}>
				{post.author.displayName}
			</a>
			•
			<span>{dayjs(post.createdAt).fromNow()}</span>
		</div>
	</div>
</div>
