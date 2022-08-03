<script>
	import { onMount } from 'svelte';
	import { initializeApp, getApps } from 'firebase/app';
	import { getFirestore } from 'firebase/firestore';

	onMount(() => {
		if (!getApps().length) {
			const app = initializeApp({
				apiKey: 'AIzaSyCxAbVlyNaOQ6pnRDlpqJVzxg7QPtDTce8',
				authDomain: 'bayquamon.firebaseapp.com',
				databaseURL: 'https://bayquamon-default-rtdb.asia-southeast1.firebasedatabase.app',
				projectId: 'bayquamon',
				storageBucket: 'bayquamon.appspot.com',
				messagingSenderId: '808682107804',
				appId: '1:808682107804:web:7b145eabdf68628c880e59'
			});
		}
	});
</script>
