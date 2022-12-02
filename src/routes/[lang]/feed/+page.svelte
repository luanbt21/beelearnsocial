<script lang="ts">
	import type { PageData } from './$types'
	import Post from '$ui/Post.svelte'
	import InfiniteScroll from '$components/InfiniteScroll.svelte'
	import { fade } from 'svelte/transition'
	import CreatePost from '$ui/CreatePost.svelte'
	import { user } from '$stores/auth'
	import { browser } from '$app/environment'
	import { registerServiceWorker } from '$lib/notification/client'
	import { onMount } from 'svelte'

	export let data: PageData

	let page = 1
	let newPosts: PageData['posts'] = []

	async function fetchData() {
		const response = await fetch(`?page=${page}`)
		const postsDate = await response.json()
		newPosts = [...newPosts, ...postsDate]
		page++
	}

	$: posts = [...data.posts, ...newPosts]

	onMount(() => {
		if (browser && $user) {
			registerServiceWorker()
		}
	})
</script>

<svelte:head>
	<title>Feed</title>
</svelte:head>
<div in:fade class="relative top-0 overflow-auto pr-2">
	{#if $user}
		<CreatePost />
	{/if}
	{#each posts as post (post.id)}
		<Post {post} />
	{/each}
	<InfiniteScroll threshold={100} on:loadMore={fetchData} />
</div>
