<script lang="ts">
	import Hashtag from '$components/Hashtag.svelte'
	import { fade } from 'svelte/transition'
	import type { PageData } from './$types'
	import Post from '$ui/Post.svelte'
	import InfiniteScroll from '$components/InfiniteScroll.svelte'
	import { page as appPage } from '$app/stores'

	export let data: PageData
	let page = 0
	let newPost: PageData['posts'] = []

	async function fetchData() {
		const response = await fetch(`${$appPage.url.search}&page=${page}`)
		newPost = await response.json()
	}

	$: posts = [...data.posts, ...newPost]
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
	<InfiniteScroll
		threshold={100}
		on:loadMore={() => {
			page++
			fetchData()
		}}
	/>
</div>
