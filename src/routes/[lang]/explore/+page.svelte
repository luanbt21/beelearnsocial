<script lang="ts">
	import type { PageData } from './$types'
	import PostCard from '$components/PostCard.svelte'
	import { fade } from 'svelte/transition'

	export let data: PageData
</script>

<div in:fade class="p-4">
	{#each data.tags as tag (tag?.name)}
		{#if tag}
			<div class="mb-12">
				<h2 class="text-xl">#{tag?.name}</h2>
				<div class="carousel p-1 space-x-4 rounded-box">
					{#each tag.posts as post (post.id)}
						<div class="carousel-item">
							<PostCard {post} />
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/each}
</div>
