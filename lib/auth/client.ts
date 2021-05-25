import firebase from "../firebase/client";

export const loginWithEmail = async (email: string, password) => {
	await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
	await firebase.auth().signInWithEmailAndPassword(email, password);

	const idToken = await firebase.auth().currentUser.getIdToken();

	return await fetch("/api/login", { 
		method: "POST",
		headers: {
			"Content-Type": "apllication/json"
		},
		body: JSON.stringify({ idToken })
	}).then(res => res.json());
};