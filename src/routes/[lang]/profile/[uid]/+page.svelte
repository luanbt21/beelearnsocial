<script lang="ts">
	import type { PageData } from './$types'
	import { LL } from '$i18n/i18n-svelte'
	import CollectionCard from '$components/CollectionCard.svelte'
	import { fade } from 'svelte/transition'
	import { page } from '$app/stores'

	export let data: PageData
	const { user } = data
</script>

<svelte:head>
	<title>{$LL.profile()}: {user.displayName}</title>
</svelte:head>
<div in:fade class="p-4 bg-base-100">
	<div class="card  h-72 rounded">
		<img
			src="https://toanthaydinh.com/wp-content/uploads/2020/04/13624171783_9f287bafdb_o.jpg"
			alt="user cover"
			class="object-cover w-full h-full rounded"
		/>
	</div>
	<div class="flex flex-row justify-items-center items-center ml-[5%] -mt-14">
		<div class="avatar">
			<div class="w-48 rounded-full">
				<img src={user?.photoURL} alt="user avatar" />
			</div>
		</div>

		<div class="ml-4">
			<h2 class="text-2xl">
				{user?.displayName}
			</h2>
			<div>
				<a class="link link-hover" href={`${$page.params.uid}/followers`}>
					{$LL.nFollowers({ nrOfFollowers: user?.followedBy.length })}
				</a>
			</div>
			<div>
				<a class="link link-hover" href={`${$page.params.uid}/following`}>
					{user?.followingIDs.length}
					{$LL.following()}
				</a>
			</div>
		</div>
	</div>

	<div class="bg-base-200 min-h-[200px] px-9 py-6 mt-6 rounded">
		<h3 class="text-xl">
			{$LL.introduction()}
		</h3>
		<textarea
			class="textarea textarea-ghost w-full h-full resize-none"
			value={user?.introduction ?? $LL.description()}
			readonly
		/>
	</div>

	<div class="bg-base-200 min-h-[200px] px-9 py-6 mt-12 rounded">
		<h3 class="text-xl">
			{$LL.collection()}
		</h3>
		{#if user?.collections}
			{#each user?.collections as collection (collection.id)}
				<CollectionCard {collection} />
			{/each}
		{/if}
	</div>
</div>
