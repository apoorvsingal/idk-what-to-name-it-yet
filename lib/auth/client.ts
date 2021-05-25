import firebase from "../firebase/client";
import fetch from "isomorphic-unfetch";

export const loginWithEmail = async (email: string, password: string) => {
	await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
	await firebase.auth().signInWithEmailAndPassword(email, password);

	const idToken = await firebase.auth().currentUser.getIdToken();

	return await fetch("/api/login", { 
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ idToken })
	}).then(res => res.json());
};

export const signupWithEmail = async (email: string, password: string, username: string, displayName: string, bio: string) => {
	await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
	await firebase.auth().createUserWithEmailAndPassword(email, password);
	await firebase.auth().currentUser.updateProfile({ displayName });
	
	const idToken = await firebase.auth().currentUser.getIdToken();

	const res = await fetch("/api/signup", { 
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ 
			idToken, 
			user: {
				username,
				bio
			} 
		})
	}).then(res => res.json());

	await firebase.auth().currentUser.sendEmailVerification();
	return res;
};