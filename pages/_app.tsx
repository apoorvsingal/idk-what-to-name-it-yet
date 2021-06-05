import { useEffect } from "react";
import firebase from "../lib/firebase/client";
import '../styles/style.css';
import Head from "next/head";

type AppProps = {
	Component: new () => JSX.ElementClass,
	pageProps: object
}

const App = function ({ Component, pageProps }: AppProps) {
	useEffect(() => {
		firebase.analytics();
	}, []);
	return (
		<>
			<Head>
				<link rel="icon" href="/kaow.png"/>
			</Head>
			<Component {...pageProps} />
		</>
	);
};

export default App;