<script lang="ts">
	import { onDestroy, createEventDispatcher } from 'svelte'

	export let threshold = 0
	export let horizontal = false
	export let elementScroll: HTMLElement | null = null

	const dispatch = createEventDispatcher()
	let isLoadMore = false
	let component: HTMLElement

	$: {
		if (component || elementScroll) {
			const element = elementScroll ? elementScroll : component.parentNode
			element?.addEventListener('scroll', onScroll)
			element?.addEventListener('resize', onScroll)
		}
	}

	const onScroll = (e: Event) => {
		const element = e.target as HTMLElement

		const offset = horizontal
			? element.scrollWidth - element.clientWidth - element.scrollLeft
			: element.scrollHeight - element.clientHeight - element.scrollTop

		if (offset <= threshold) {
			if (!isLoadMore) {
				dispatch('loadMore')
			}
			isLoadMore = true
		} else {
			isLoadMore = false
		}
	}

	onDestroy(() => {
		if (component || elementScroll) {
			const element = elementScroll ? elementScroll : component.parentNode

			element?.removeEventListener('scroll', onScroll)
			element?.removeEventListener('resize', onScroll)
		}
	})
</script>

<div bind:this={component} style="width:0px" />
