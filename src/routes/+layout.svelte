<script lang="ts">
	import '../app.css';
	import Header from '$lib/ui/Header.svelte';
	import { setLocale } from '$i18n/i18n-svelte';
	import Firebase from '$lib/firebase.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	setLocale(data.locale);
</script>

<Firebase />
<div class="drawer">
	<input id="drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="w-full navbar bg-base-300">
			<div class="flex-none lg:hidden">
				<label for="drawer" class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-6 h-6 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/></svg
					>
				</label>
			</div>
			<div class="flex-1 px-2 mx-2">Navbar Title</div>
			<div class="flex-none hidden lg:block">
				<ul class="menu menu-horizontal">
					<Navbar />
				</ul>
			</div>
		</div>
		<!-- Page content here -->
		<Header />

		<main>
			<slot />
		</main>

		<footer>
			<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
		</footer>
	</div>
	<div class="drawer-side">
		<label for="drawer" class="drawer-overlay" />
		<ul class="menu p-4 overflow-y-auto w-80 bg-base-100">
			<!-- Sidebar content here -->
			<Navbar />
		</ul>
	</div>
</div>
