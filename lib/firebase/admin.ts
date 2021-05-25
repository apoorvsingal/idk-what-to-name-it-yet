import admin from "firebase-admin";

export const credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDS) as admin.ServiceAccount);
export default admin;