<script lang="ts">
	import type { PageData } from './$types'
	import { LL } from '$i18n/i18n-svelte'
	import CollectionCard from '$components/CollectionCard.svelte'
	import BarChart from '$components/BarChart.svelte'
	import { fade, scale } from 'svelte/transition'
	import { page } from '$app/stores'
	import { getUserId } from '$utils/client'
	import { user } from '$stores/auth'
	import { fileListToUrl } from '$utils'
	import { enhance } from '$app/forms'

	export let data: PageData
	const chartData = Array.from({ length: 6 }).fill(0) as number[]
	data.levels.forEach((level) => {
		chartData[level.level - 1] = level._count._all
	})

	let hoverCover = false
	let uploadImage: FileList
	$: previewURL = fileListToUrl(uploadImage)[0]

	let introductionValue = data.user.introduction
</script>

<svelte:head>
	<title>{$LL.profile()}: {data.user.displayName}</title>
</svelte:head>
<div in:fade class="p-4 bg-base-100">
	<div
		class="card h-72 rounded relative"
		on:mouseenter={() => (hoverCover = true)}
		on:mouseleave={() => (hoverCover = false)}
	>
		<img
			src={previewURL ||
				data.user.coverImageURL ||
				'https://cdn.pixabay.com/photo/2017/01/06/23/05/sunrise-1959243_960_720.jpg'}
			alt="user cover"
			class="object-cover w-full h-full rounded"
		/>
		<div class="absolute bottom-2 right-2" class:hidden={!hoverCover}>
			<form action="?/update" method="post" enctype="multipart/form-data" use:enhance>
				<input
					type="file"
					class="file-input glass"
					name="coverImage"
					accept="image/*"
					bind:files={uploadImage}
				/>
				{#if uploadImage && uploadImage.length}
					<button class="btn glass">{$LL.save()}</button>
				{/if}
			</form>
		</div>
	</div>
	<div class="flex flex-wrap justify-center sm:justify-start items-end ml-[5%] -mt-10">
		<div class="avatar">
			<div class="w-48 rounded-full">
				<img src={data.user.photoURL} alt="user avatar" />
			</div>
		</div>

		<div class="flex flex-col ml-4 mb-5">
			<h2 class="text-2xl">
				{data.user.displayName}
			</h2>
			<a class="link link-hover" href="{$page.params.uid}/followers">
				{$LL.nFollowers({ nrOfFollowers: data.user.followedByIDs.length })}
			</a>

			<a class="link link-hover" href="{$page.params.uid}/following">
				{data.user.followingIDs.length}
				{$LL.following()}
			</a>

			{#if getUserId() === data.user.id}
				<a class="link link-hover" href="{$page.params.uid}/hidden-posts">Hidden posts</a>
			{/if}
		</div>
	</div>

	<div>
		<BarChart {chartData} />
	</div>

	<div class="bg-base-200 px-9 py-6 mt-6 rounded">
		<h3 class="text-xl">
			{$LL.introduction()}
		</h3>
		<form action="?/update" method="post" use:enhance>
			<p />
			<textarea
				class="textarea textarea-ghost w-full resize-none overflow-hidden"
				placeholder={$LL.description()}
				name="introduction"
				value={data.user.introduction}
				readonly={data.user.uid !== $user?.uid}
				on:input={(e) => {
					introductionValue = e.currentTarget.value
					e.currentTarget.style.height = '100%'
					e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
				}}
				maxlength="500"
				required
			/>
			{#if data.user.uid === $user?.uid && introductionValue !== data.user.introduction}
				<button out:scale class="btn btn-block">{$LL.save()}</button>
			{/if}
		</form>
	</div>

	<div class="bg-base-200 min-h-[200px] px-9 py-6 mt-12 rounded">
		<h3 class="text-xl">
			{$LL.collection()}
		</h3>
		{#if data.user.collections}
			<div class="flex gap-2 justify-evenly">
				{#each data.user.collections as collection (collection.id)}
					<CollectionCard {collection} />
				{/each}
			</div>
		{/if}
	</div>
</div>
