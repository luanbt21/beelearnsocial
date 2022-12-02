<script lang="ts">
	import { appFetch, appGet, appPost, toastError, toastSuccess } from '$utils/client'
	import type { Collection } from '@prisma/client'
	import LL, { locale } from '$i18n/i18n-svelte'
	import { onMount } from 'svelte'

	export let destroy: () => void
	export let postId: string

	const id = postId + 'AddCollection'

	let showModal = true
	let collections: Collection[] = []

	let collectionId: string
	let newCollectionName: string

	onMount(async () => {
		const res = await appGet('/api/collections')
		if (!res.ok) {
			toastError('Failed')
			destroy()
		}
		collections = await res.json()
	})

	const handlePost = async () => {
		try {
			showModal = false
			const res = await appPost('/api/collections', {
				postId,
				collectionId,
				newCollectionName,
			})
			if (!res.ok) {
				toastError('Failed')
				return
			}
			const data = (await res.json()) as { id: string; name: string }
			toastSuccess(
				$LL.savedTo() +
					' ' +
					`<a href="/${$locale}/collections/${data.id}" class="link">${data.name}</a>`,
				{ pausable: true },
			)
		} finally {
			destroy()
		}
	}

	const handleUnsave = async (e: { currentTarget: HTMLButtonElement }, collectionId: string) => {
		const btn = e.currentTarget

		btn.classList.add('loading')
		const res = await appFetch('/api/collections', 'PATCH', {
			postId,
			collectionId,
		})
		if (res.ok) {
			btn.classList.replace('loading', 'hidden')
		} else {
			toastError('Failed')
			btn.classList.remove('loading')
		}
	}
</script>

<input type="checkbox" {id} class="modal-toggle" bind:checked={showModal} />
<div class="modal">
	<div class="modal-box relative">
		<label for={id} class="btn btn-sm btn-circle absolute right-2 top-2" on:click={destroy}>
			✕
		</label>
		<h3 class="text-xl font-bold text-center">{$LL.saveTo()}</h3>
		{#if collections.length}
			<div class="py-2 border-y-2">
				{#each collections as collection}
					{#if collection.postIDs.includes(postId)}
						<div class="label">
							<span class="text-lg">{collection.name}</span>
							<button
								class="btn btn-sm btn-outline btn-error normal-case"
								on:click={(e) => handleUnsave(e, collection.id)}
							>
								{$LL.unsave()}
							</button>
						</div>
					{:else}
						<label class="label btn btn-ghost">
							<span class="normal-case text-lg">{collection.name}</span>
							<input
								type="radio"
								name="collectionId"
								bind:group={collectionId}
								class="radio radio-primary"
								value={collection.id}
							/>
						</label>
					{/if}
				{/each}
			</div>
		{/if}
		<div class="py-2 border-y-2">
			<input
				type="search"
				placeholder={$LL.newCollection()}
				class="input input-bordered input-primary w-full"
				bind:value={newCollectionName}
			/>
		</div>
		<div class="flex justify-end mt-2">
			<button
				class="btn btn-primary normal-case"
				disabled={!newCollectionName && !collectionId}
				on:click={handlePost}
			>
				{newCollectionName ? $LL.create() : $LL.done()}
			</button>
		</div>
	</div>
</div>
