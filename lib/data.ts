
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

export interface NewUser {
	username: string,
	bio: string
};
export enum UserRole {
	USER,
	MODERATOR,
	ADMIN,
	OWNER
};

export interface UserInfo {
	uid: Uid,
	displayName: string | null,
	email: string | null,
	photoURL: string | null,
	username: string,
	upvotes: number,
	role: UserRole,
	bio: string
};
export interface UserData {
	username: string,
	bio: string,
	upvotes: number,
	role: UserRole,
	startedProjectTypes: Uid[],
	completedProjectTypes: Uid[]
};
export class User extends Entity<UserData> {};

export interface CommentData {
	userId: Uid,
	projectId: Uid,
	replyTo: Uid,
	comment: string,
	replies: Uid[],
	edits: { comment: string, timestamp: Date }[],
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
	edits: { projectTypeId: Uid, url: Url, description: string, timestamp: Date }[],
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