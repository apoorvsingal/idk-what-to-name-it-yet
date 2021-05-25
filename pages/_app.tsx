import { useEffect } from "react";
import firebase from "../lib/firebase/client";

const App = function ({ Component, pageProps }) {
	useEffect(() => {
		firebase.analytics();
	}, []);

	return <Component {...pageProps}/>;
};

export default App;