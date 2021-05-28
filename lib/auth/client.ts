import initFirebase from "../firebase/client";
import { login, signup } from "../api";

const firebaseProm = initFirebase(true);

export const loginWithEmail = async (email: string, password: string) => {
	const firebase = await firebaseProm;

	await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
	await firebase.auth().signInWithEmailAndPassword(email, password);

	const currentUser = await firebase.auth().currentUser;

	if(!currentUser){
		throw new Error;
	}
	return await login({ idToken: await currentUser.getIdToken() });
};

export const signupWithEmail = async (email: string, password: string, username: string) => {
	const firebase = await firebaseProm;

	await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
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