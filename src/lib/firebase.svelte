<script>
	import { initializeApp, getApps } from 'firebase/app';

	if (!getApps().length) {
		initializeApp({
			apiKey: 'AIzaSyCxAbVlyNaOQ6pnRDlpqJVzxg7QPtDTce8',
			authDomain: 'bayquamon.firebaseapp.com',
			projectId: 'bayquamon',
			storageBucket: 'bayquamon.appspot.com',
			messagingSenderId: '808682107804',
			appId: '1:808682107804:web:7b145eabdf68628c880e59'
		});
	}
</script>
