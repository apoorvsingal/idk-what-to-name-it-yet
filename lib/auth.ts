import admin, { credential } from "./firebase/admin";
import { User } from "./db";

export interface NewUser {
	email: string,
	username: string,
	displayName: string,
	password: string
};

export class AuthHandler {
	private _inited: boolean = false;
	private _firebase_auth: admin.auth.Auth;

	async init(){
		if(!this._inited){
			await admin.initializeApp({ credential });
			this._firebase_auth = admin.auth();
			this._inited = true;
		}
	}
	async createUser(user: NewUser): Promise<User> {
		// validate input
		
		this._firebase_auth.createUser({
			emailVerified: false,
			...user
		});
		return;
	};
};