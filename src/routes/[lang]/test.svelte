<script lang="ts">
	import { getUserMedia } from '$utils/webRTC';

	let localVideo: HTMLVideoElement;
	// let remoteVideo: HTMLVideoElement;

	const setVideoSrc = async () => {
		try {
			const { localStream } = await getUserMedia();
			localVideo.srcObject = localStream;
		} catch (error) {
			console.error(error);
		}
	};
</script>

<button class="btn" on:click={setVideoSrc}>create offer</button>

<video bind:this={localVideo} autoplay playsinline />
<!-- <video bind:this={remoteVideo} autoplay playsinline /> -->
