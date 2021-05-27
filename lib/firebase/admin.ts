import admin from "firebase-admin";

const FIREBASE_CREDS = process.env.FIREBASE_CREDS;

if(!FIREBASE_CREDS){
	throw new Error("FIREBASE_CREDS env variable not found.");
}

export const credential = admin.credential.cert(JSON.parse(FIREBASE_CREDS) as admin.ServiceAccount);
export default admin;