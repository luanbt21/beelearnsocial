<script lang="ts">
	import type { PageData } from './$types'
	import Post from '$ui/Post.svelte'
	import LL, { locale } from '$i18n/i18n-svelte'

	export let data: PageData
</script>

<div class="p4">
	<div class="text-center mb-6">
		<h1 class="text-2xl font-bold">{$LL.collection()}: {data.name}</h1>
		<div>
			<span>{$LL.by()}</span>
			<a class="link text-xl font-semibold" href="/{$locale}/profile/{data.user.uid}">
				{data.user.displayName}
			</a>
		</div>
	</div>
	{#each data.posts as post (post.id)}
		<Post {post} />
	{/each}
</div>
