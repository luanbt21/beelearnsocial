<script lang="ts">
	import '../app.css'
	import { setLocale } from '$i18n/i18n-svelte'
	import Firebase from '$lib/firebase.svelte'
	import Navbar from '$lib/components/Navbar.svelte'
	import type { LayoutData } from './$types'
	import Sidebar from '$components/Sidebar.svelte'
	import dayjs from 'dayjs'
	import 'dayjs/locale/vi'
	import { page } from '$app/stores'

	export let data: LayoutData

	setLocale(data.locale)
	switch ($page.params.lang) {
		case 'vi':
			dayjs.locale('vi')
			break
	}
</script>

<Firebase />
<div class="drawer">
	<input id="drawer-left" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="w-full navbar sticky top-0 bg-base-200 z-50">
			<div class="navbar-start">
				<div class="flex-none lg:hidden">
					<label for="drawer-left" class="btn btn-square btn-sm btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block w-6 h-6 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</label>
				</div>
				<a href="/">
					<div class="flex flex-1 mx-1">
						<img class="mr-2" src="/logo.svg" alt="" />
						<div class="hidden lg:block">
							<h3 class="font-medium leading-tight text-xl">BeeLearnSocial</h3>
							<p class="text-xs text-gray-300">enjoy learning - keep learning</p>
						</div>
					</div>
				</a>
			</div>

			<div class="navbar-center">
				<div class="form-control hidden lg:block">
					<input type="text" placeholder="Search" class="input input-bordered" />
				</div>
			</div>

			<div class="navbar-end">
				<Navbar />
			</div>
		</div>

		<div class="flex relative top-0 overflow-auto">
			<aside class="w-64 hidden lg:block sticky top-0">
				<Sidebar />
			</aside>
			<main class="container mx-auto p-6">
				<slot />
			</main>
		</div>
	</div>
	<div class="drawer-side">
		<label for="drawer-left" class="drawer-overlay" />
		<ul class="menu p-4 overflow-y-auto w-80 bg-base-100">
			<Sidebar />
		</ul>
	</div>
</div>
