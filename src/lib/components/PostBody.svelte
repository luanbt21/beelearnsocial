<script lang="ts">
	import bbb from '$lib/assets/bbb.mp4'
	export let props: {
		videos: string[]
		audios: string[]
		images: string[]
	} = {
		videos: [bbb],
		audios: [],
		images: [],
	}
</script>

<div class="carousel w-full">
	{#each props.videos as src}
		<div id={src} class="carousel-item w-full">
			<video>
				<track kind="captions" />
				<source {src} type="video/mp4" />
				Failed to load video
			</video>
		</div>
	{/each}
	{#each props.audios as src}
		<div id={src} class="carousel-item w-full">
			<audio {src} class="w-full" />
		</div>
	{/each}
	{#each props.images as src}
		<div id={src} class="carousel-item w-full">
			<img {src} alt="" class="w-full" />
		</div>
	{/each}
</div>
<div class="flex justify-center w-full py-2 gap-2">
	{#each props.videos as src}
		<a href="#{src}" class="btn btn-xs btn-secondary">•</a>
	{/each}
	{#each props.audios as src}
		<a href="#{src}" class="btn btn-xs btn-accent">•</a>
	{/each}
	{#each props.images as src}
		<a href="#{src}" class="btn btn-xs btn-info">•</a>
	{/each}
</div>
