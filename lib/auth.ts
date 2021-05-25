import admin, { credential } from "./firebase/admin";
import { Database, User, UserData } from "./db";
import { userSetter } from "core-js/fn/symbol";

export interface NewUser {
	email: string,
	username: string,
	displayName: string,
	password: string
};

export class AuthHandler {
	private _db: Database;

	async init(){
		await this._db.init();
	}
	async createUser(idToken: string, username, bio): Promise<User> {
		const { uid } = await this.verifyIdToken(idToken);
		const firebaseUser = await admin.auth().getUser(uid);

		const user: User = new User(uid, {
			username: null,
			displayName: firebaseUser.displayName,
			photoURL: firebaseUser.photoURL,
			bio: null,
			upvotes: 0
		});
		await this._db.users().save(user);

		return user;
	};
	verifyIdToken(idToken: string){
		return admin.auth().verifyIdToken(idToken);
	};
	async getSessionCookie(idToken: string): Promise<{ cookie: string, maxAge: number }> {
		const { auth_time } = await this.verifyIdToken(idToken);
		
		if (new Date().getTime() / 1000 - auth_time > 5 * 60) {
			throw new Error("Inalid ID Token");
		}
		const expiresIn = 1000 * 60 * 60 * 24 * 5;

		return {
			cookie: await admin.auth().createSessionCookie(idToken, { expiresIn }),
			maxAge: expiresIn
		};
	};
};