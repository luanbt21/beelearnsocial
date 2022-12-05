<script lang="ts">
	import type { Post } from '@prisma/client'
	import { LL } from '$i18n/i18n-svelte'
	import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

	export let post: Post
	let isQuestion = post.options.length > 0
	let answer = ''
	let checked = false
</script>

{#if isQuestion}
	{#each post.options as option}
		<label
			class="label justify-start cursor-pointer rounded-lg mb-1 mx-[10%]"
			class:text-error={checked && answer === option.value && !option.type}
			class:text-success={checked && option.type}
		>
			<input
				type="radio"
				disabled={checked}
				bind:group={answer}
				value={option.value}
				class="radio"
				class:radio-error={checked && answer === option.value && !option.type}
				class:radio-success={checked && option.type}
			/>
			<span class="ml-4">
				{option.value}
			</span>

			{#if checked && answer === option.value && !option.type}
				<svg class="ml-4 remix w-6 h-6 fill-current">
					<use href="{remixiconUrl}#ri-close-fill" />
				</svg>
			{/if}
			{#if checked && option.type}
				<svg class="ml-4 remix w-6 h-6 fill-current">
					<use href="{remixiconUrl}#ri-check-fill" />
				</svg>
			{/if}
		</label>
	{/each}
	{#if checked}
		<div class="mb-2 break-words">
			{@html post.description}
		</div>
	{/if}

	{#if !checked}
		<button
			class="btn btn-sm w-full btn-primary"
			disabled={!answer || checked}
			on:click={() => (checked = true)}
		>
			{$LL.check()}
		</button>
	{:else}
		<button
			class="btn btn-sm w-full btn-warning"
			disabled={!answer}
			on:click={() => {
				answer = ''
				checked = false
			}}
		>
			{$LL.reset()}
		</button>
	{/if}
{:else}
	<div class="mb-2 break-words">
		{@html post.description}
	</div>
{/if}
