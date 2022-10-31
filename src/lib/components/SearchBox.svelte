<script lang="ts">
	import { goto } from '$app/navigation'
	import { locale } from '$i18n/i18n-svelte'
	let q = ''
</script>

<form
	action={`/${$locale}/search`}
	on:submit|preventDefault={() => {
		goto(`/${$locale}/search?q=${q}`)
	}}
>
	<div class="form-control hidden lg:block">
		<input
			type="text"
			name="q"
			bind:value={q}
			placeholder="Search"
			class="input input-bordered w-[500px]"
		/>
	</div>
</form>
