import { useEffect } from "react";
import initFirebase from "../lib/firebase/client";
import '../styles/style.css';

type AppProps = {
	Component: new () => JSX.ElementClass,
	pageProps: object
}

const firebaseProm = initFirebase();

const App = function ({ Component, pageProps }: AppProps) {
	useEffect(() => {
		firebaseProm.then(firebase => firebase.analytics());
	}, []);

	return <Component {...pageProps}/>;
};

export default App;