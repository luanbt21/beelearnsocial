<script lang="ts">
	import type { Tag } from '@prisma/client'
	import { locale } from '$i18n/i18n-svelte'

	export let tag: Omit<Tag, 'postIDs'>
</script>

<a
	class="link link-hover font-medium mr-2"
	href="/{$locale}/explore/tag?name={tag.name}"
	title={tag.description}
>
	#{tag.name}
	<slot />
</a>
