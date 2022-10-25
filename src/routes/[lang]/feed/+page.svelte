<script lang="ts">
	import type { PageData } from './$types'
	import Post from '$ui/Post.svelte'
	import InfiniteScroll from '$components/InfiniteScroll.svelte'

	export let data: PageData

	let page = 0
	let posts = [...data.posts]
	let newPost: any[] = []

	async function fetchData() {
		const response = await fetch(`?page=${page}`)
		newPost = await response.json()
	}

	$: posts = [...posts, ...newPost]
</script>

<div class="relative top-0 overflow-auto max-w-3xl pr-2">
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
