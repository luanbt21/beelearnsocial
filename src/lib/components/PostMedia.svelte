<script lang="ts">
	import type { Post } from '@prisma/client'
	import { onMount } from 'svelte'

	export let post: Post
	let Carousel: any

	onMount(async () => {
		// @ts-ignore
		const module = await import('svelte-carousel')
		Carousel = module.default
	})
</script>

<svelte:component this={Carousel}>
	{#each post.videos as src}
		<div id={post.id + src} class="carousel-item w-full">
			<video class="w-full my-auto" controls>
				<track kind="captions" />
				<source {src} type="video/mp4" />
				Failed to load video
			</video>
		</div>
	{/each}
	{#each post.audios as src}
		<div id={post.id + src} class="carousel-item w-full">
			<audio class="w-full my-auto" controls>
				<source {src} type="audio/mpeg" />
				Fail to load audio
			</audio>
		</div>
	{/each}
	{#each post.images as src}
		<div id={post.id + src} class="carousel-item w-full">
			<img {src} alt="" class="mx-auto my-auto" />
		</div>
	{/each}
</svelte:component>

<noscript>
	<div class="carousel w-full">
		{#each post.videos as src}
			<div id={post.id + src} class="carousel-item w-full">
				<video class="w-full" controls>
					<track kind="captions" />
					<source {src} type="video/mp4" />
					Failed to load video
				</video>
			</div>
		{/each}
		{#each post.audios as src}
			<div id={post.id + src} class="carousel-item w-full items-center">
				<audio class="w-full" controls>
					<source {src} type="audio/mpeg" />
				</audio>
			</div>
		{/each}
		{#each post.images as src}
			<div id={post.id + src} class="carousel-item w-full">
				<img {src} alt="" class="w-full" />
			</div>
		{/each}
	</div>
	<div class="flex justify-center w-full py-2 gap-2">
		{#each post.videos as src}
			<a href="#{post.id + src}" class="btn btn-xs btn-secondary">•</a>
		{/each}
		{#each post.audios as src}
			<a href="#{post.id + src}" class="btn btn-xs btn-accent">•</a>
		{/each}
		{#each post.images as src}
			<a href="#{post.id + src}" class="btn btn-xs btn-info">•</a>
		{/each}
	</div>
</noscript>
