<script lang="ts">
	import type { PageData } from './$types'
	import PostCard from '$components/PostCard.svelte'
	import { fade } from 'svelte/transition'
	import { LL, locale } from '$i18n/i18n-svelte'

	export let data: PageData
</script>

<svelte:head>
	<title>Explore</title>
</svelte:head>
<div in:fade class="p-4">
	{#each data.tags as tag (tag.name)}
		{#if tag}
			<div class="pb-10 mb-10 border-b-2">
				<div class="flex justify-between">
					<h2 class="text-xl">#{tag.name}</h2>
					<a class="link" href="/{$locale}/explore/tag?name={tag.name}">{$LL.seeMore()}</a>
				</div>
				<div class="carousel p-1 space-x-4 rounded-box">
					{#each tag.posts as post (post.id)}
						<div class="carousel-item bg-base-100 rounded-box">
							<PostCard {post} />
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/each}
</div>
