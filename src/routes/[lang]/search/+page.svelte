<script lang="ts">
	import Hashtag from '$components/Hashtag.svelte'
	import { fade } from 'svelte/transition'
	import type { PageData } from './$types'
	import Post from '$ui/Post.svelte'
	import InfiniteScroll from '$components/InfiniteScroll.svelte'
	import { page as appPage } from '$app/stores'
	import { appGet } from '$utils/client'

	export let data: PageData
	let page = 0
	let newPosts: PageData['posts'] = []

	async function fetchData() {
		const response = await appGet(`${$appPage.url.search}&page=${page}`)
		const postsDate = await response.json()
		newPosts = [...newPosts, ...postsDate]
		page++
	}

	$: posts = [...data.posts, ...newPosts]
</script>

<svelte:head>
	<title>Search</title>
</svelte:head>
<div in:fade class="relative top-0 overflow-auto">
	<div class="bg-base-100 p-4 rounded-box mb-4">
		<h3 class="text-2xl font-bold mb-3">Tags</h3>
		{#each data.tags as tag}
			{#if tag}
				<Hashtag {tag}>
					({tag._count.posts})
				</Hashtag>
			{/if}
		{/each}
	</div>
	{#each posts as post (post.id)}
		<Post {post} />
	{/each}
	<InfiniteScroll threshold={100} on:loadMore={fetchData} />
</div>
