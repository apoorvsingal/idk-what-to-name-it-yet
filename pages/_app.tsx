import { useEffect } from "react";
import firebase from "../lib/firebase/client";
import '../styles/style.css';

const App = function ({ Component, pageProps }) {
	useEffect(() => {
		firebase.analytics();
	}, []);

	return <Component {...pageProps}/>;
};

export default App;