import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export const loginWithGoogle = async () => {
	try {
		const auth = getAuth();
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
	} catch (e) {}
};

export const logout = async () => {
	await getAuth().signOut();
};
