<script lang="ts">
	import type { Collection } from '@prisma/client'
	import { locale } from '$i18n/i18n-svelte'

	export let collection: Collection
</script>

<div class="card w-96 bg-base-200 shadow-xl">
	<a href={`/${$locale}/collection/${collection.id}`}>
		<div class="card-body">
			<h2 class="card-title">{collection.name}</h2>
			<p>{collection.description}</p>
		</div>
	</a>
</div>
