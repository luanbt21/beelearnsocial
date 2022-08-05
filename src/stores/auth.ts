import { readable } from 'svelte/store';
import { getAuth, type User } from 'firebase/auth';

export const user = readable<User | null>(null, (set) => {
	getAuth().onAuthStateChanged((user) => {
		set(user);
	});
});
