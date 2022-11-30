<script lang="ts">
	import { enhance } from '$app/forms'
	import LL from '$i18n/i18n-svelte'
	import type { Plan } from '@prisma/client'
	import dayjs from 'dayjs'

	export let item: Plan
</script>

<div class="p-4 bg-base-100 rounded">
	<form action="?/update" method="post" class="flex items-center gap-2" use:enhance>
		<input type="hidden" name="id" value={item.id} />
		<div class="w-full">
			<input
				type="text"
				name="description"
				class="input input-ghost w-full"
				autocomplete="off"
				value={item.description}
				class:text-success={item.status}
				required
			/>
		</div>
		<input
			type="checkbox"
			checked={item.status}
			name="status"
			value="true"
			class="checkbox checkbox-success checkbox-lg"
		/>
		<button class="btn">{$LL.save()}</button>
	</form>
	<div class="flex justify-between mx-4">
		<p class="label-text">{dayjs(item.updatedAt).fromNow()}</p>
		<p class="label-text">{$LL.created()} {dayjs(item.createdAt).fromNow()}</p>
	</div>
</div>
