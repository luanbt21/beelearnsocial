<script lang="ts">
	import type { PageData } from './$types'
	import { LL } from '$i18n/i18n-svelte'
	import CollectionCard from '$components/CollectionCard.svelte'
	import BarChart from '$components/BarChart.svelte'
	import { fade } from 'svelte/transition'
	import { page } from '$app/stores'
	import { getUserId } from '$utils'

	export let data: PageData
	const chartData = Array.from({ length: 6 }).fill(0) as number[]
	data.levels.forEach((level) => {
		chartData[level.level - 1] = level._count._all
	})
</script>

<svelte:head>
	<title>{$LL.profile()}: {data.user.displayName}</title>
</svelte:head>
<div in:fade class="p-4 bg-base-100">
	<div class="card  h-72 rounded">
		<img
			src="https://toanthaydinh.com/wp-content/uploads/2020/04/13624171783_9f287bafdb_o.jpg"
			alt="user cover"
			class="object-cover w-full h-full rounded"
		/>
	</div>
	<div class="flex flex-row justify-items-center items-end ml-[5%] -mt-14">
		<div class="avatar">
			<div class="w-48 rounded-full">
				<img src={data.user?.photoURL} alt="user avatar" />
			</div>
		</div>

		<div class="flex flex-col ml-4 mb-5">
			<h2 class="text-2xl">
				{data.user?.displayName}
			</h2>
			<a class="link link-hover" href={`${$page.params.uid}/followers`}>
				{$LL.nFollowers({ nrOfFollowers: data.user?.followedBy.length })}
			</a>

			<a class="link link-hover" href={`${$page.params.uid}/following`}>
				{data.user?.followingIDs.length}
				{$LL.following()}
			</a>

			{#if getUserId() === data.user.id}
				<a class="link link-hover" href={`${$page.params.uid}/hidden-posts`}>Hidden posts</a>
			{/if}
		</div>
	</div>

	<div>
		<BarChart {chartData} />
	</div>

	<div class="bg-base-200 min-h-[200px] px-9 py-6 mt-6 rounded">
		<h3 class="text-xl">
			{$LL.introduction()}
		</h3>
		<textarea
			class="textarea textarea-ghost w-full h-full resize-none"
			value={data.user?.introduction ?? $LL.description()}
			readonly
		/>
	</div>

	<div class="bg-base-200 min-h-[200px] px-9 py-6 mt-12 rounded">
		<h3 class="text-xl">
			{$LL.collection()}
		</h3>
		{#if data.user?.collections}
			{#each data.user?.collections as collection (collection.id)}
				<CollectionCard {collection} />
			{/each}
		{/if}
	</div>
</div>
