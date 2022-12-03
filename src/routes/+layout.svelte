<script lang="ts">
	import type { LayoutData } from './$types'
	import Sidebar from '$components/Sidebar.svelte'
	import CreatePostModal from '$components/CreatePostModal.svelte'
	import { setLocale } from '$i18n/i18n-svelte'
	import Firebase from '$lib/Firebase.svelte'
	import Navbar from '$ui/Navbar.svelte'
	import { showCreatePostModal } from '$stores'
	import '../app.scss'
	import { CreatePostModalId } from '$lib/constant'

	export let data: LayoutData

	setLocale(data.locale)
</script>

<Firebase />
<div class="drawer">
	<input id="drawer-left" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col min-h-screen bg-base-200">
		<Navbar />
		<slot />
		<input
			type="checkbox"
			id={CreatePostModalId}
			class="modal-toggle"
			bind:checked={$showCreatePostModal}
		/>
		{#if $showCreatePostModal}
			<CreatePostModal id={CreatePostModalId} />
		{/if}
	</div>
	<div class="drawer-side">
		<label for="drawer-left" class="drawer-overlay" />
		<ul class="p-4 overflow-y-auto w-72 bg-base-100">
			<Sidebar />
		</ul>
	</div>
</div>
