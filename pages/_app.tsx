import { useEffect } from "react";
import firebase from "../lib/firebase/client";

const firebaseConfig = {
	apiKey: "AIzaSyDtag9jH3j703JxXCK3sqCfOZ4Ng3p105s",
	authDomain: "p-8280b.firebaseapp.com",
	projectId: "p-8280b",
	storageBucket: "p-8280b.appspot.com",
	messagingSenderId: "893530043447",
	appId: "1:893530043447:web:f0f4bea6380751da517bb2",
	measurementId: "G-W2VLMJ52PZ"
};

const App = function ({ Component, pageProps }) {
	useEffect(() => {
		firebase.initializeApp(firebaseConfig);
		firebase.analytics();
	}, []);

	return <Component {...pageProps}/>;
};

export default App;