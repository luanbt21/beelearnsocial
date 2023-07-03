<script lang="ts">
	import { locale } from '$i18n/i18n-svelte'
	import type { Tag } from '@prisma/client'
	import { LL } from '$i18n/i18n-svelte'
	import { appGet } from '$utils/client'

	let q = ''
	let tags: Tag[] = []
	let tagEntered: string[] = []
	$: suggest = tags.some(({ name }) => name === q)
		? [...tags.map((tag) => tag.name)]
		: [...tags.map((tag) => tag.name), q]

	const fetchSuggest = async () => {
		q = q.trim()
		q = q.replaceAll(/\W/g, '')
		const res = await appGet(`/${$locale}/search/tag?q=${q}`)
		tags = await res.json()
		tags = tags.filter(({ name }) => !tagEntered.includes(name))
	}

	const completeTagName = (tagName: string) => {
		if (!tagEntered) return
		if (!tagEntered.includes(tagName)) {
			tagEntered = [...tagEntered, tagName]
		}
		q = ''
	}

	const handleEnter = (e: KeyboardEvent) => {
		if (!q) return
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			completeTagName(suggest[0] || '')
		}
	}

	const removeEnteredTag = (name: string) => {
		tagEntered = tagEntered.filter((tag) => tag !== name)
	}
</script>

<div class="flex flex-wrap gap-2">
	{#each tagEntered as tagName}
		<div class="badge badge-lg gap-2">
			<input type="hidden" name="tag" value={tagName} />
			{tagName}
			<button on:click={() => removeEnteredTag(tagName)}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="inline-block w-4 h-4 stroke-current"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	{/each}
</div>

<div class="form-control">
	<div class="dropdown dropdown-end">
		<input
			type="input"
			placeholder={$LL.addTags()}
			class="input input-bordered w-full"
			autocomplete="off"
			bind:value={q}
			on:input={fetchSuggest}
			on:keydown={handleEnter}
		/>
		{#if q}
			<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-full z-10">
				{#each suggest as tag (tag)}
					<li>
						<button on:click={() => completeTagName(tag)}>
							#{tag}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
