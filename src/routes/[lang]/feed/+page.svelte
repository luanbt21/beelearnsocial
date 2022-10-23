<script lang="ts">
	import type { PageData } from './$types'
	import Post from '$ui/Post.svelte'

	export let data: PageData
</script>

{#each data.posts as post (post.id)}
	<Post {post} />
{/each}
