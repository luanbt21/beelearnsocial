<script lang="ts">
	import type { PageData } from './$types'
	import Post from '$ui/Post.svelte'
	import InfiniteScroll from '$components/InfiniteScroll.svelte'
	import { fade } from 'svelte/transition'

	export let data: PageData

	let page = 0
	let newPost: any[] = []

	async function fetchData() {
		const response = await fetch(`?page=${page}&name=${data.tagName}`)
		newPost = await response.json()
	}

	$: posts = [...data.posts, ...newPost]
</script>

<svelte:head>
	<title>{data.tagName}</title>
</svelte:head>
<div in:fade class="relative top-0 overflow-auto pr-2">
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
