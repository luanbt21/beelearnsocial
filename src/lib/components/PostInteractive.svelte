<script lang="ts">
	import type { Post } from '@prisma/client'
	import { LL } from '$i18n/i18n-svelte'
	import Svg from '$components/Svg.svelte'

	export let post: Post

	const width = 20
	const height = 20
</script>

<div class="mt-4 pt-4 border-t">
	<div class="flex flex-row justify-between items-center">
		<div>
			<button class="btn btn-sm btn-ghost">
				<Svg name="love" {width} {height} />
				<span class="ml-1">20</span>
			</button>
			<button class="btn btn-sm btn-ghost">
				<Svg name="comment" {width} {height} />
				<span class="ml-1">12</span>
			</button>
		</div>

		<div>
			<button class="btn">{$LL.learn()}</button>
		</div>
	</div>
</div>
