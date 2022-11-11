<script lang="ts">
	import { locale } from '$i18n/i18n-svelte'
	import { page } from '$app/stores'
	type MenuItem = { icon: string; title: string; href: string }

	const titles = ['feed', 'explore', 'plans', 'collections', 'users', 'profile']

	const menu: MenuItem[] = titles.map((title) => ({
		title,
		icon: `/${title}-icon.svg`,
		href: `/${$locale}/${title}`,
	}))

	$: activeTitle = $page.url.pathname.split('/')[2]
</script>

<ul class="menu w-64 p-2 rounded-box mx-auto">
	{#each menu as item}
		<li class="my-2">
			<a
				on:click={() => {
					activeTitle = item.title
					// @ts-ignore
					document.getElementById('drawer-left').checked = false
				}}
				class:active={item.title === activeTitle}
				href={item.href}
			>
				<img src={item.icon} alt="" />
				<span class="capitalize">
					{item.title}
				</span>
			</a>
		</li>
	{/each}
</ul>
