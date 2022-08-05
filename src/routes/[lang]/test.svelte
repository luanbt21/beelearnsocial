<script lang="ts">
	import { getUserMedia, createOffer, answerCall } from '$utils/webRTC';
	import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let localVideo: HTMLVideoElement;
	let remoteVideo: HTMLVideoElement;
	let id: string | undefined;

	let remoteStreamRef: MediaStream;

	const setVideoSrc = async () => {
		try {
			const { localStream, remoteStream } = await getUserMedia();
			remoteStreamRef = remoteStream;
			localVideo.srcObject = localStream;
			remoteVideo.srcObject = remoteStream;
		} catch (error) {
			console.error(error);
		}
	};

	onMount(() => {
		const db = getFirestore();
		const calls = collection(db, 'calls');
		onSnapshot(calls, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					id = change.doc.id;
				}
			});
		});
	});
</script>

<button class="btn" on:click={setVideoSrc}>Get Medio</button>
<button
	class="btn"
	on:click={async () => {
		id = await createOffer();
	}}>create offer</button
>

<input type="text" bind:value={id} />
<button
	class="btn"
	on:click={() => {
		answerCall(id);
	}}>Answer Call</button
>
<button
	class="btn"
	on:click={() => {
		remoteStreamRef.getTracks().forEach((track) => console.log(track));
	}}>log</button
>
<video class="rotate-y-180" bind:this={localVideo} autoplay playsinline />
<video bind:this={remoteVideo} autoplay playsinline />
