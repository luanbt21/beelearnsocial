<script lang="ts">
	import type { Post } from '@prisma/client'
	import { onMount } from 'svelte'

	export let post: Post
	let Carousel: any

	onMount(async () => {
		if (post.audios.length + post.videos.length + post.images.length > 1) {
			post.videos.length = 0
			// @ts-ignore
			const module = await import('svelte-carousel')
			Carousel = module.default
		}
	})
</script>

{#if post.audios.length > 1}
	<svelte:component this={Carousel}>
		{#each post.audios as src}
			<div class="carousel-item mb-2">
				<audio class="w-full" controls>
					<source {src} type="audio/mpeg" />
					Fail to load audio
				</audio>
			</div>
		{/each}
	</svelte:component>
{:else}
	{#each post.audios as src}
		<div class="mb-2">
			<audio class="w-full" controls>
				<source {src} type="audio/mpeg" />
				Fail to load audio
			</audio>
		</div>
	{/each}
{/if}

{#if post.videos.length + post.images.length > 1}
	<svelte:component this={Carousel}>
		{#each post.videos as src}
			<div class="carousel-item w-full">
				<video class="w-full my-auto" controls>
					<track kind="captions" />
					<source {src} type="video/mp4" />
					Failed to load video
				</video>
			</div>
		{/each}
		{#each post.images as src}
			<div class="carousel-item w-full">
				<img {src} alt="" class="mx-auto my-auto" />
			</div>
		{/each}
	</svelte:component>
{:else}
	{#each post.videos as src}
		<div class="carousel-item w-full">
			<video class="w-full my-auto" controls>
				<track kind="captions" />
				<source {src} type="video/mp4" />
				Failed to load video
			</video>
		</div>
	{/each}
	{#each post.images as src}
		<div class="carousel-item w-full">
			<img {src} alt="" class="mx-auto my-auto" />
		</div>
	{/each}
{/if}
