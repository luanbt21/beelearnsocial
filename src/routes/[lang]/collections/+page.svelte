<script lang="ts">
	import PostCard from '$components/PostCard.svelte'
	import type { PageData } from './$types'
	import { LL, locale } from '$i18n/i18n-svelte'
	import { fade } from 'svelte/transition'
	import { authLoading, showLoginModal, user } from '$stores/auth'
	import { handleHideLoginModal } from '$utils/client'

	export let data: PageData

	$: if (!$authLoading && !$user) {
		$showLoginModal = true
	}

	$: handleHideLoginModal($showLoginModal, $user)
</script>

<svelte:head>
	<title>Collection</title>
</svelte:head>

<div in:fade class="p-4">
	{#if data.collections}
		{#each data.collections as collection (collection.name)}
			<div class="mb-12">
				<a
					class="text-xl font-bold link link-hover"
					href={`/${$locale}/collections/${collection.id}`}
				>
					{collection.name}
				</a>

				<p>{collection.postIDs.length} {$LL.posts()}</p>
				<div class="carousel p-1 space-x-4 rounded-box">
					{#each collection.posts as post (post.id)}
						<div class="carousel-item rounded-box bg-base-100">
							<PostCard {post} />
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>
