import { useEffect } from "react";
import firebase from "../lib/firebase/client";
import '../styles/style.css';

type AppProps = {
	Component: new () => JSX.ElementClass,
	pageProps: object
}

const App = function ({ Component, pageProps }: AppProps) {
	useEffect(() => {
		firebase.analytics();
	}, []);

	return <Component {...pageProps}/>;
};

export default App;