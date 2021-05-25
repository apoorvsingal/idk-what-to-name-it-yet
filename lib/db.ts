import { initializeApp } from "firebase-admin";
import admin, { credential } from "./firebase/admin";

export type Uid = string;
export type Url = string;

export class Entity<T> {
	uid: Uid;
	data: T;

	constructor(uid: string, data: T){
		this.uid = uid;
		this.data = data;
	}
};

export interface TechStackData {
	icon: string,
	name: string,
	description: string
};
export class TechStack extends Entity<TechStackData> {};

export interface ProjectTypeData {
	icon: Url,
	name: string,
	description: string,
	stack: string
};
export class ProjectType extends Entity<ProjectTypeData> {};

export interface UserData {
	username: string,
	displayName: string,
	bio: string,
	photoURL: Url,
	upvotes: number
};
export class User extends Entity<UserData> {};

export interface CommentData {
	user: Uid,
	projectId: Uid,
	comment: string,
	timestamp: Date
};
export class Comment extends Entity<CommentData> {};

export interface ProjectData {
	userId: Uid,
	projectTypeId: Uid,
	url: Url,
	description: string,
	upvotes: Vote[],
	comments: Uid[],
	edits: { type: Uid, url: Url, description: string, timestamp: Date }[],
	timestamp: Date
};
export class Project extends Entity<ProjectData> {};

export class Vote {
	user: Uid;
	timestamp: Date;

	constructor(user: Uid, timestamp: Date){
		this.user = user;
		this.timestamp = timestamp;
	}
};

export class Database {
	async init(){
		if (!admin.apps.length) {
			await admin.initializeApp({ credential });
		}
	};
	collectionRaw(name: string): admin.firestore.CollectionReference {
		return admin.firestore().collection(name);
	};
	collection<T extends Entity<any>>(TConstructor: { new (uid: string, data: any): T; }, name: string): Collection<T> {
		return new Collection<T>(TConstructor, this, name);
	};
	projects(): Collection<Project> {
		return this.collection<Project>(Project, "projects");
	};
	users(): Collection<User> {
		return this.collection<User>(User, "users");
	};
	projectTypes(): Collection<ProjectType> {
		return this.collection<ProjectType>(ProjectType, "projectTypes");
	};
	techStacks(): Collection<TechStack> {
		return this.collection<TechStack>(TechStack, "techStacks");
	};
	comments(): Collection<Comment> {
		return this.collection<Comment>(Comment, "comments");
	};
};

export class Collection<T extends Entity<any>> {
	_TConstructor: { new (uid: string, data: any): T; };
	private _firestore_collec: admin.firestore.CollectionReference;
	db: Database;
	
	constructor(TConstructor: { new (uid: string, data: any): T; }, db: Database, name: string){
		this._TConstructor = TConstructor;
		this.db = db;
		this._firestore_collec = db.collectionRaw(name);
	};
	async save(entity: T){
		await this._firestore_collec.doc(entity.uid).set(entity.data);
	};
	async add(entity: T){
		const { id } = await this._firestore_collec.add(entity.data);
		entity.uid = id;
	};
	async get(uid: string): Promise<T> {
		const docRef = await this._firestore_collec.doc(uid).get();
		
		if(!docRef.exists){
			throw new Error(`${uid} does not exist.`);
		}
		return new this._TConstructor(uid, docRef.data());
	};
	async find(queries: Array<[string, string, any]>, options?: { offset?: number, limit?: number, order?: { by: string, direction: string } }){
		let queryRef: admin.firestore.CollectionReference | admin.firestore.Query = this._firestore_collec;

		for(let [prop, operator, value] of queries){
			queryRef = queryRef.where(prop, operator as any, value);
		}
		if(options.order){
			queryRef = queryRef.orderBy(options.order.by, options.order.direction as any);
		}
		if(options.offset){
			queryRef = queryRef.startAfter(options.offset);
		}
		if(options.limit){
			queryRef = queryRef.limit(options.limit);
		}
		const { docs } = await queryRef.get();
		const entities: T[] = [];

		for(let doc of docs){
			entities.push(new this._TConstructor(doc.id, doc.data()));
		}
		return entities;
	};
};