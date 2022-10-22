<script lang="ts">
    import type { PageData } from './$types';
    import FeedPostCard from '$components/FeedPostCard.svelte';
    export let data: PageData;
</script>

<h1>Feed</h1>
<FeedPostCard/>