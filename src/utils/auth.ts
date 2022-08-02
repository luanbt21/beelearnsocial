import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export const loginWithGoogle = async () => {
	try {
		const auth = getAuth();
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider).then((value) => console.log(value));
	} catch (e) {
		console.log(e);
	}
};

export const logout = async () => {
	await getAuth().signOut();
};
