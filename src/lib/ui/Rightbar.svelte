<script lang="ts">
	import type { Tag } from '@prisma/client'
	import Hashtag from '$components/Hashtag.svelte'

	export let tags: (Tag | null)[]
</script>

<div class="my-8">
	<div>
		<h3 class="text-2xl font-bold mb-3">Tags</h3>
		{#each tags as tag}
			{#if tag}
				<Hashtag {tag} />
			{/if}
		{/each}
	</div>
</div>
