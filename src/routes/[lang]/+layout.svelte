<script lang="ts">
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
	switch ($page.params.lang) {
		case 'vi':
			dayjs.locale('vi')
			break
	}
</script>

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

<SvelteToast />
