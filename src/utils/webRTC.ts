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
	const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
	const remoteStream = new MediaStream();

	localStream.getTracks().forEach((track) => {
		RTC.getInstance().addTrack(track, localStream);
	});

	RTC.getInstance().ontrack = (event) => {
		event.streams[0].getTracks().forEach((track) => {
			remoteStream.addTrack(track);
		});
	};

	return { localStream, remoteStream };
};

export const createOffer = async () => {
	const db = getFirestore();
	try {
		const callDoc = doc(collection(db, 'calls'));
		const offerCandidates = collection(callDoc, 'offerCandidates');
		const answerCandidates = collection(callDoc, 'answerCandidates');

		RTC.getInstance().onicecandidate = (event) => {
			event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
		};

		const offerDescription = await RTC.getInstance().createOffer();
		await RTC.getInstance().setLocalDescription(offerDescription);

		const offer = {
			sdp: offerDescription.sdp,
			type: offerDescription.type
		};

		await setDoc(callDoc, { offer });

		onSnapshot(callDoc, (snapshot) => {
			const data = snapshot.data();
			if (!RTC.getInstance().currentLocalDescription && data?.answer) {
				const answerDescription = new RTCSessionDescription(data.answer);
				RTC.getInstance().setRemoteDescription(answerDescription);
			}
		});

		onSnapshot(answerCandidates, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					const candidate = new RTCIceCandidate(change.doc.data());
					RTC.getInstance().addIceCandidate(candidate);
				}
			});
		});

		return callDoc.id;
	} catch (error) {
		console.log(error);
	}
};

export const answerCall = async (id: string) => {
	const pc = RTC.getInstance();
	const db = getFirestore();
	const callDoc = doc(collection(db, 'calls'), id);
	const answerCandidates = collection(callDoc, 'answerCandidates');
	const offerCandidates = collection(callDoc, 'offerCandidates');

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
