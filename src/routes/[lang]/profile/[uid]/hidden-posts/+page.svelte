<script lang="ts">
	import type { PageData } from './$types'
	import Post from '$ui/Post.svelte'
	import { fade } from 'svelte/transition'

	export let data: PageData
</script>

<svelte:head>
	<title>Hidden posts</title>
</svelte:head>
<div in:fade class="relative top-0 overflow-auto pr-2">
	{#each data.posts as post (post.id)}
		<Post {post} />
	{/each}
</div>
