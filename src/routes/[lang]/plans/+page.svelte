<script lang="ts">
	import { fade } from 'svelte/transition'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<svelte:head>
	<title>Plans</title>
</svelte:head>
<div in:fade class="p-4">
	<h1>Plan</h1>
</div>
