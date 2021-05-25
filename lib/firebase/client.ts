import firebase from "firebase";
import "firebase/analytics";
import "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyDtag9jH3j703JxXCK3sqCfOZ4Ng3p105s",
	authDomain: "p-8280b.firebaseapp.com",
	projectId: "p-8280b",
	storageBucket: "p-8280b.appspot.com",
	messagingSenderId: "893530043447",
	appId: "1:893530043447:web:f0f4bea6380751da517bb2",
	measurementId: "G-W2VLMJ52PZ"
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}
export default firebase;