import firebase from "../firebase/client";
import { login, signup } from "../api";

export const loginWithEmail = async (email: string, password: string) => {
	await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
	await firebase.auth().signInWithEmailAndPassword(email, password);

	const idToken = await firebase.auth().currentUser.getIdToken();

	return await login({ idToken });
};

export const signupWithEmail = async (email: string, password: string, username: string, displayName: string, bio: string) => {
	await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
	await firebase.auth().createUserWithEmailAndPassword(email, password);
	await firebase.auth().currentUser.updateProfile({ displayName });
	
	const idToken = await firebase.auth().currentUser.getIdToken();

	const res = await signup({ 
		idToken, 
		user: { username, bio }
	});
	await firebase.auth().currentUser.sendEmailVerification();
	return res;
};