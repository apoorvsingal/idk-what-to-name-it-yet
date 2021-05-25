import { AuthHandler } from "../../../lib/auth/server";
import { Uid, Database, ProjectType, Comment, CommentData } from "../../../lib/db";

const db = new Database;
const auth = new AuthHandler;

const getComment = async (req, res) => {
	const commentId: Uid = req.query.commentId;
	res.send(await db.comments().get(commentId));
};

const editComment = async (req, res) => {
	const commentId: Uid = req.query.commentId;
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

	await db.comments().save(new Comment(commentId, req.body));
	res.send({ ok: true });
};

export default async (req, res) => {
	try {
		await auth.init();
		await db.init();

		switch(req.method){
		case "GET":
			return await getComment(req, res);
		case "PUT":
			return await editComment(req, res);
		}
		res.status(400).end();
	} catch(error){
		console.error(error);
		res.status(500).send({ error: error.message });
	}
};