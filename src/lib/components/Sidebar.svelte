<script lang="ts">
	import { locale } from '$i18n/i18n-svelte'
	import { onMount } from 'svelte'

	type MenuItem = { icon: string; title: string; href: string }

	const titles = ['feed', 'explore', 'plan', 'course', 'collection', 'following', 'profile']

	const menu: MenuItem[] = titles.map((title) => ({
		title,
		icon: `/${title}-icon.svg`,
		href: `/${$locale}/${title}`,
	}))

	let activeTitle: string

	onMount(() => {
		activeTitle = location.pathname.split('/')[2]
	})
</script>

<ul class="menu w-64 p-2 rounded-box">
	{#each menu as item}
		<li on:click={() => (activeTitle = item.title)} class="my-2">
			<a class:active={item.title === activeTitle} href={item.href}>
				<img src={item.icon} alt="" />
				<span class="capitalize">
					{item.title}
				</span>
			</a>
		</li>
	{/each}
</ul>
