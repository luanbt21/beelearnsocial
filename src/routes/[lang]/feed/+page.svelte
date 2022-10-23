<script lang="ts">
	import type { PageData } from './$types'
	import FeedPostCard from '$ui/FeedPostCard.svelte'

	export let data: PageData
</script>

{#each data.posts as post (post.id)}
	<FeedPostCard {post} />
{/each}
