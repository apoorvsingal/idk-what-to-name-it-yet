import { AuthHandler } from "../../../lib/auth/server";
import { Uid, Database, Project, Comment, CommentData } from "../../../lib/db";

const db = new Database;
const auth = new AuthHandler;

const getComment = async (req, res) => {
	const query = [];

	const projectId: Uid = req.query.projectId;
	const userId: Uid = req.query.userId;

	if(projectId){
		query.push(["projectId", "==", projectId]);
	}
	if(userId){
		query.push(["userId", "==", userId]);
	}
	res.send(await db.comments().find(query, { offset: Number(req.query.offest), limit: Number(req.query.limit) }));
};

const addComment = async (req, res) => {
	const commentData: CommentData = req.body;
	const sessionCookie: string = req.cookies.session;

	try {
		const { uid: userId } = await auth.verifySessionCookie(sessionCookie);

		if(userId != commentData.userId){
			throw new Error;
		}
	} catch(error){
		return res.status(401).send({ error: "Unauthorized" });
	}
	
	try {
		await db.projects().get(commentData.projectId);
	} catch(error){
		return res.status(400).send({ error: "Invalid project" });
	}

	await db.comments().add(new Comment(null, req.body));
	res.send({ ok: true });
};

export default async (req, res) => {
	try {
		await auth.init();
		await db.init();

		switch(req.method){
		case "GET":
			return await getComment(req, res);
		case "POST":
			return await addComment(req, res);
		}
		res.status(400).end();
	} catch(error){
		console.error(error);
		res.status(500).send({ error: error.message });
	}
};