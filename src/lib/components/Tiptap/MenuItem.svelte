<script lang="ts">
	import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

	export let icon: string = ''
	export let title: string = ''
	export let action: Function | undefined = undefined
	export let isActive: Function | undefined = undefined
</script>

<template>
	<button
		class="menu-item"
		class:active={isActive ? isActive() : false}
		on:click={() => {
			if (action) action()
		}}
		{title}
	>
		<svg class="remix w-full h-full fill-current">
			<use href={`${remixiconUrl}#ri-${icon}`} />
		</svg>
	</button>
</template>

<style>
	.menu-item {
		width: 1.75rem;
		height: 1.75rem;
		border: none;
		background-color: transparent;
		border-radius: 0.4rem;
		padding: 0.25rem;
		margin-right: 0.25rem;
	}

	button.active {
		background: black;
		color: white;
	}
</style>
