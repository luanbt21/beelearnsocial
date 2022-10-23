<script lang="ts">
	import type { Tag } from '@prisma/client'
	import { locale } from '$i18n/i18n-svelte'

	export let tag: Tag
</script>

<a class="link link-hover font-medium" href="/{$locale}/explore/posts?tag={tag.name}">
	#{tag.name}
</a>
