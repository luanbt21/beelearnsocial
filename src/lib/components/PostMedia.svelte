<script lang="ts">
	export let audios: string[]
	export let images: string[]
	export let videos: string[]
	const uid = crypto.randomUUID()

	const genId = (name: string, index: number) => {
		return name + uid + index
	}

	let audioCarousel: HTMLDivElement
	let mediaCarousel: HTMLDivElement

	const slice = (event: MouseEvent, carousel: HTMLDivElement) => {
		event.preventDefault()
		const btn = event.currentTarget as Element
		const href = btn.getAttribute('href') || ''
		const target = carousel.querySelector<HTMLDivElement>(href)
		if (target) {
			const left = target.offsetLeft
			carousel.scrollTo({ left: left, behavior: 'smooth' })
		}
	}
</script>

{#if audios.length > 0}
	<div bind:this={audioCarousel} class="carousel w-full">
		{#each audios as src, i}
			<div id={genId('audio', i)} class="carousel-item gap-1 w-full relative mb-2 items-center">
				{#if audios.length > 1}
					<a
						on:click={(e) => slice(e, audioCarousel)}
						href="#{genId('audio', i - 1)}"
						class="btn btn-sm btn-ghost btn-circle"
						disabled={i === 0 ? true : undefined}
					>
						❮
					</a>
				{/if}
				<audio class="w-full" controls>
					<source {src} type="audio/mpeg" />
					Fail to load audio
				</audio>
				{#if audios.length > 1}
					<a
						on:click={(e) => slice(e, audioCarousel)}
						href="#{genId('audio', i + 1)}"
						class="btn btn-sm btn-ghost btn-circle"
						disabled={i === audios.length - 1 ? true : undefined}
					>
						❯
					</a>
				{/if}
			</div>
		{/each}
	</div>
{/if}

{#if videos.length + images.length > 0}
	<div bind:this={mediaCarousel} class="carousel">
		{#each videos as src, i}
			<div id={genId('media', i)} class="carousel-item w-full">
				<video class="w-full my-auto max-h-[30rem]" controls>
					<track kind="captions" />
					<source {src} type="video/mp4" />
					Failed to load video
				</video>
			</div>
		{/each}
		{#each images as src, i}
			<div id={genId('media', i + videos.length)} class="carousel-item w-full">
				<img {src} alt="" class="max-h-[30rem] mx-auto my-auto" />
			</div>
		{/each}
	</div>

	{#if videos.length + images.length > 1}
		<div class="flex justify-center w-full py-2 gap-2">
			{#each [...videos, ...images] as _, i}
				<a on:click={(e) => slice(e, mediaCarousel)} href="#{genId('media', i)}" class="btn btn-xs">
					{i + 1}
				</a>
			{/each}
		</div>
	{/if}
{/if}
