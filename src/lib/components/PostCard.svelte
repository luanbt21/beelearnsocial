<script lang="ts">
	import type { Post } from '@prisma/client'

	export let post: Post
</script>

<div class="card card-compact w-80 shadow">
	<figure class="h-60">
		{#if post.images.length}
			<img class="object-cover w-full h-full" src={post.images[0]} alt="post" />
		{:else if post.videos.length}
			<video src={post.videos[0]} />
		{:else}
			<pre>{@html post.content}</pre>
		{/if}
	</figure>
	<div class="card-body">
		<h2 class="card-title">{post.title}</h2>
		<p>{@html post.caption}</p>
	</div>
</div>
