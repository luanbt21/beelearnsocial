<script lang="ts">
	import PostCard from '$components/PostCard.svelte'
	import type { PageData } from './$types'
	import { goto } from '$app/navigation'
	import { user } from '$stores/auth'
	import { locale } from '$i18n/i18n-svelte'
	import { browser } from '$app/environment'
	import { LL } from '$i18n/i18n-svelte'
	import { fade } from 'svelte/transition'

	if (browser && !$user) {
		goto(`/${$locale}/login`)
	}

	export let data: PageData
</script>

<svelte:head>
	<title>Collection</title>
</svelte:head>

<div in:fade class="p-4">
	{#each data.collections as collection (collection.name)}
		<div class="mb-12">
			<h2 class="text-xl font-bold">{collection.name}</h2>
			<p>{collection.postIDs.length} {$LL.posts()}</p>
			<div class="p-1 space-x-4 rounded-box">
				{#each collection.posts as post (post.id)}
					<div class="carousel-item rounded-box bg-base-100">
						<PostCard {post} />
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
