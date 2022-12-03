<script lang="ts">
	import { goto } from '$app/navigation'
	import { locale } from '$i18n/i18n-svelte'
	import type { Tag } from '@prisma/client'
	import { LL } from '$i18n/i18n-svelte'
	import { appGet } from '$utils/client'
	let q = ''
	let tags: Tag[] = []

	const fetchSuggest = async () => {
		q = q.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
		const res = await appGet(`/${$locale}/search/tag?q=${q}`)
		tags = await res.json()
	}
</script>

<form action="/{$locale}/search">
	<div class="form-control">
		<div class="dropdown dropdown-end">
			<input
				type="search"
				name="q"
				placeholder={$LL.search()}
				class="input input-bordered w-full"
				autocomplete="off"
				bind:value={q}
				on:input={fetchSuggest}
			/>
			{#if tags.length}
				<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
					{#each tags as tag (tag.id)}
						<li><button on:click={() => (q = tag.name)}>#{tag.name}</button></li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</form>
