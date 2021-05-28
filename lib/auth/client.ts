import firebase from "../firebase/client";
import { login, signup } from "../api";
import "firebase/auth";

export const loginWithEmail = async (email: string, password: string) => {
	await firebase.auth().signInWithEmailAndPassword(email, password);

	const currentUser = firebase.auth().currentUser;

	if(!currentUser){
		throw new Error;
	}
	return await login({ idToken: await currentUser.getIdToken() });
};

export const loginWithGoogle = async (): Promise<{idToken?: string, exists: boolean}> => {
	const provider = new firebase.auth.GoogleAuthProvider();
	const result = await firebase.auth().signInWithPopup(provider);

	const idToken = await firebase.auth().currentUser?.getIdToken();

	if(result.additionalUserInfo?.isNewUser){
		return { idToken, exists: false };
	}	
	await login({ idToken });
	return { exists: true };
};

export const signupWithEmail = async (email: string, password: string, username: string) => {
	await firebase.auth().createUserWithEmailAndPassword(email, password);
	
	const currentUser = firebase.auth().currentUser;
	
	if(!currentUser){
		throw new Error;
	}
	const idToken = await currentUser.getIdToken();
	const res = await signup({ idToken, user: { username }});

	await currentUser.sendEmailVerification();
	return res;
};

export const signupWithIdToken = async (username: string) => {
	const idToken = await firebase.auth().currentUser?.getIdToken();
	const res = await signup({ idToken, user: { username }});

	return res;
};