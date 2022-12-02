<script lang="ts">
	import type { PageData } from './$types'
	import Post from '$ui/Post.svelte'
	import LL from '$i18n/i18n-svelte'

	export let data: PageData
</script>

<div class="p4">
	<h1 class="text-2xl font-bold text-center mb-6">{$LL.collection()}: {data.name}</h1>
	{#each data.posts as post (post.id)}
		<Post {post} />
	{/each}
</div>
