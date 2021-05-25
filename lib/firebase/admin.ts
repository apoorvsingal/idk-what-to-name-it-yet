import admin from "firebase-admin";
import serviceAccount from "./serviceAccount.key";

export const credential = admin.credential.cert(serviceAccount);
export default admin;