import React, { useEffect } from "react";
import firebase from "../lib/firebase/client";

export default () => {
	useEffect(() => {
		firebase.auth().createUserWithEmailAndPassword("apoorvsingal0@gmail.com", "hehehe").then(console.log);
	}, []);

	return <>
		<div>Yo</div>
	</>
};