import {
	getFirestore,
	doc,
	setDoc,
	collection,
	addDoc,
	onSnapshot,
	getDoc,
	updateDoc
} from 'firebase/firestore';

const servers: RTCConfiguration = {
	iceServers: [
		{
			urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
		}
	],
	iceCandidatePoolSize: 10
};

class RTC {
	private static pc: RTCPeerConnection;

	static getInstance() {
		if (!this.pc) {
			this.pc = new RTCPeerConnection(servers);
		}
		return this.pc;
	}
}

export const getUserMedia = async () => {
	const localStream = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true
	});
	const remoteStream = new MediaStream();

	const pc = RTC.getInstance();
	localStream.getTracks().forEach((track) => {
		pc.addTrack(track, localStream);
	});

	pc.ontrack = (event) => {
		console.log(event.streams[0].getTracks().length)
		event.streams[0].getTracks().forEach((track) => {
			remoteStream.addTrack(track);
		});
	};

	return {
		localStream: await navigator.mediaDevices.getUserMedia({
			video: true
		}),
		remoteStream
	};
};

export const createOffer = async () => {
	const db = getFirestore();
	try {
		const callDoc = doc(collection(db, 'calls'));
		const offerCandidates = collection(callDoc, 'offerCandidates');
		const answerCandidates = collection(callDoc, 'answerCandidates');

		const pc = RTC.getInstance();
		pc.onicecandidate = (event) => {
			event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
		};

		const offerDescription = await pc.createOffer();
		await pc.setLocalDescription(offerDescription);

		const offer = {
			sdp: offerDescription.sdp,
			type: offerDescription.type
		};

		await setDoc(callDoc, { offer });

		onSnapshot(callDoc, (snapshot) => {
			const data = snapshot.data();
			if (!pc.currentLocalDescription && data?.answer) {
				console.log(data)
				const answerDescription = new RTCSessionDescription(data.answer);
				pc.setRemoteDescription(answerDescription);
			}
		});

		onSnapshot(answerCandidates, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					const candidate = new RTCIceCandidate(change.doc.data());
					pc.addIceCandidate(candidate);
				}
			});
		});

		return callDoc.id;
	} catch (error) {
		console.log(error);
	}
};

export const answerCall = async (id?: string) => {
	if (!id) return;
	const db = getFirestore();
	const callDoc = doc(collection(db, 'calls'), id);
	const answerCandidates = collection(callDoc, 'answerCandidates');
	const offerCandidates = collection(callDoc, 'offerCandidates');

	const pc = RTC.getInstance();
	pc.onicecandidate = (event) => {
		event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
	};

	const callData = (await getDoc(callDoc)).data();

	const offerDescription = callData?.offer;
	await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

	const answerDescription = await pc.createAnswer();
	await pc.setLocalDescription(answerDescription);

	const answer = {
		sdp: answerDescription.sdp,
		type: answerDescription.type
	};
	await updateDoc(callDoc, { answer });

	onSnapshot(offerCandidates, (snapshot) => {
		snapshot.docChanges().forEach((change) => {
			if (change.type === 'added') {
				const data = change.doc.data();
				pc.addIceCandidate(new RTCIceCandidate(data));
			}
		});
	});
};
