<script lang="ts">
	import type { Post, Reaction, Tag } from '@prisma/client'
	import Hashtag from '$components/Hashtag.svelte'
	import SveltyPicker from 'svelty-picker'

	export let tags: {
		id: string
		name: string
		description: string
		posts: (Post & {
			author: User
			reactions: Reaction[]
		})[]
		_count: {
			posts: number
		}
	}[]
</script>

<div>
	<SveltyPicker pickerOnly inputClasses="w-full mx-auto" />
	<div class="bg-base-100 p-4 rounded-box">
		<h3 class="text-2xl font-bold mb-3">Tags</h3>
		{#each tags as tag}
			{#if tag}
				<Hashtag {tag} />
			{/if}
		{/each}
	</div>
</div>
