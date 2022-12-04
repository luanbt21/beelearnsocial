<script lang="ts">
	import type { PageData } from './$types'
	import Post from '$ui/Post.svelte'
	import InfiniteScroll from '$components/InfiniteScroll.svelte'
	import { fade } from 'svelte/transition'
	import { appGet } from '$utils/client'
	import { afterNavigate } from '$app/navigation'

	export let data: PageData

	let page = 1
	let newPosts: PageData['posts'] = []

	afterNavigate(({ from, to }) => {
		if (to?.url.href !== from?.url.href) {
			page = 1
			newPosts = []
		}
	})

	async function fetchData() {
		const response = await appGet(`?page=${page}&name=${data.tagName}`)
		const postsData = await response.json()
		newPosts = [...newPosts, ...postsData]
		page++
	}

	$: posts = [...data.posts, ...newPosts]
</script>

<svelte:head>
	<title>{data.tagName}</title>
</svelte:head>
<div in:fade class="relative top-0 overflow-auto pr-2">
	{#each posts as post (post.id)}
		<Post {post} />
	{/each}
	<InfiniteScroll threshold={100} on:loadMore={fetchData} />
</div>
