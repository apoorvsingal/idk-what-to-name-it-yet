import { initializeApp } from "firebase-admin";
import admin, { credential } from "./firebase/admin";

export class Entity<T> {
	uid: string;
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
export interface TechStackMeta {
	uid: string,
	icon: string, // url
	name: string
};

export class TechStack extends Entity<TechStackData> {
	constructor(uid: string, data: TechStackData){
		super(uid, data);
	};
	meta(): TechStackMeta {
		return {
			uid: this.uid,
			icon: this.data.icon,
			name: this.data.name
		};
	};
};

export interface ProjectTypeData {
	icon: string, // url
	name: string,
	description: string,
	stack: string
};
export interface ProjectTypeMeta {
	uid: string,
	icon: string, // url
	name: string,
	stack: string
};
export class ProjectType extends Entity<ProjectTypeData> {
	constructor(uid: string, data: ProjectTypeData){
		super(uid, data);
	};
	meta(): ProjectTypeMeta {
		return {
			uid: this.uid,
			icon: this.data.icon,
			name: this.data.name,
			stack: this.data.stack
		};
	};
};

export interface UserData {
	username: string,
	displayName: string,
	bio: string,
	photoURL: string, // url
	upvotes: number
};
export interface UserMeta {
	uid: string,
	username: string,
	displayName: string,
	photoURL: string // url
};
export class User extends Entity<UserData> {
	constructor(uid: string, data: UserData){
		super(uid, data);
	}
	meta(): UserMeta {
		return {
			uid: this.uid,
			username: this.data.username,
			displayName: this.data.displayName,
			photoURL: this.data.photoURL
		}
	};
};

export interface CommentData {
	user: UserMeta,
	comment: string,
	timestamp: Date
};
export interface CommentMeta {
	uid: string,
	comment: string,
	user: UserMeta,
	timestamp: Date
};
export class Comment extends Entity<CommentData> {
	constructor(uid: string, data: CommentData){
		super(uid, data);
	}
	meta(): CommentMeta {
		return {
			uid: this.uid,
			comment: this.data.comment,
			user: this.data.user,
			timestamp: this.data.timestamp
		}
	};
};

export class Vote {
	user: UserMeta;
	timestamp: Date;

	constructor(user: UserMeta, timestamp: Date){
		this.user = user;
		this.timestamp = timestamp;
	}
};

export interface ProjectData {
	user: UserMeta,
	type: ProjectTypeMeta,
	url: string,
	description: string,
	upvotes: Vote[],
	comments: Comment[],
	edits: ProjectMeta[],
	timestamp: Date
};
export interface ProjectMeta {
	uid: string,
	type: ProjectTypeMeta,
	url: string,
	description: string,
	timestamp: Date
};
export class Project extends Entity<ProjectData> {
	constructor(uid: string, data: ProjectData){
		super(uid, data);
	};
	meta(): ProjectMeta {
		return {
			uid: this.uid,
			type: this.data.type,
			url: this.data.url,
			description: this.data.description,
			timestamp: this.data.timestamp
		};
	};
};

export class Database {
	private _firestore_db: admin.firestore.Firestore;
	private _inited: boolean = false;

	async init(){
		if(!this._inited){
			await admin.initializeApp({ credential });
			this._firestore_db = admin.firestore();
			this._inited = true;
		}
	};
	collectionRaw(name: string): admin.firestore.CollectionReference {
		return this._firestore_db.collection(name);
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
	async get(uid: string): Promise<T> {
		const docRef = await this._firestore_collec.doc(uid).get();
		
		if(!docRef.exists){
			throw new Error(`${uid} does not exist.`);
		}
		return new this._TConstructor(uid, docRef.data());
	};
	async find(queries: Array<[string, string, any]>, options?: { offset: number, limit: number, order: { by: string, direction: string } }){
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