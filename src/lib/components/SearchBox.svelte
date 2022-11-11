<script lang="ts">
	import { goto } from '$app/navigation'
	import { locale } from '$i18n/i18n-svelte'
	import type { Tag } from '@prisma/client'
	let q = ''
	let tags: Tag[] = []

	const fetchSuggest = async () => {
		const res = await fetch(`/${$locale}/search/tag?q=${q}`)
		tags = await res.json()
	}
</script>

<form
	action={`/${$locale}/search`}
	on:submit|preventDefault={() => {
		goto(`/${$locale}/search?q=${q}`)
	}}
>
	<div class="form-control hidden lg:block">
		<div class="dropdown dropdown-end">
			<input
				type="text"
				name="q"
				placeholder="Search"
				class="input input-bordered w-[500px]"
				autocomplete="off"
				bind:value={q}
				on:input={fetchSuggest}
			/>
			{#if tags.length}
				<ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
					{#each tags as tag (tag.id)}
						<li><button on:click={() => (q = tag.name)}>#{tag.name}</button></li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</form>
