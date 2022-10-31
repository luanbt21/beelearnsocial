<script lang="ts">
	import Hashtag from '$components/Hashtag.svelte'
	import { fade } from 'svelte/transition'
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	export let data: PageData
</script>

<div in:fade class="bg-base-100 p-4 rounded-box">
	<h3 class="text-2xl font-bold mb-3">Tags</h3>
	{#each data.tags as tag}
		{#if tag}
			<Hashtag {tag}>
				({tag._count.posts})
			</Hashtag>
		{/if}
	{/each}
</div>
