<script lang="ts">
	import { setLocale } from '$i18n/i18n-svelte'
	import Firebase from '$lib/Firebase.svelte'
	import Navbar from '$ui/Navbar.svelte'
	import type { LayoutData } from './$types'
	import Sidebar from '$components/Sidebar.svelte'
	import Rightbar from '$ui/Rightbar.svelte'
	import dayjs from 'dayjs'
	import 'dayjs/locale/vi'
	import { page } from '$app/stores'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import relativeTime from 'dayjs/plugin/relativeTime'
	import utc from 'dayjs/plugin/utc'

	export let data: LayoutData

	dayjs.extend(relativeTime)
	dayjs.extend(utc)
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
	<div class="drawer-content flex flex-col min-h-screen bg-base-200">
		<Navbar />

		<div class="flex w-full mx-auto pt-4 overflow-hidden min-h-[90%]">
			<aside class="w-72 hidden lg:block rounded-box bg-base-100">
				<Sidebar />
			</aside>
			<main class="flex flex-col w-full max-w-5xl ml-auto overflow-auto">
				<slot />
			</main>
			<aside class="w-72 mx-auto hidden lg:block">
				<Rightbar tags={data.tags} />
			</aside>
		</div>
	</div>
	<div class="drawer-side">
		<label for="drawer-left" class="drawer-overlay" />
		<ul class="menu p-4 overflow-y-auto w-72 bg-base-100">
			<Sidebar />
		</ul>
	</div>
</div>

<SvelteToast />
