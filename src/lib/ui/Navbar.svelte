<script>
	import NavbarMenu from '$components/NavbarMenu.svelte'
	import SearchBox from '$components/SearchBox.svelte'
	import { locale } from '$i18n/i18n-svelte'
</script>

<div class="navbar bg-base-100 z-50">
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
		<a href="/{$locale}">
			<div class="flex flex-1 mx-1">
				<img class="mr-2 w-5 h-11 md:w-auto" src="/logo.png" alt="BeeLeanSocialLogo" />
				<div class="hidden lg:block">
					<h3 class="font-medium leading-tight text-xl">BeeLearnSocial</h3>
					<p class="text-xs text-gray-300">enjoy learning - keep learning</p>
				</div>
			</div>
		</a>
	</div>

	<div class="navbar-center w-2/5 hidden lg:block">
		<SearchBox />
	</div>

	<div class="navbar-end">
		<NavbarMenu />
	</div>
</div>
