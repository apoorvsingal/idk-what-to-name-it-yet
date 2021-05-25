import { Uid, Database, ProjectType, Comment } from "../../../lib/db";

const db = new Database;

export default async (req, res) => {
	await db.init();
	
	const commentId: Uid = req.query.commentId;
	const projectId: Uid = req.query.projectId;
	const userId: Uid = req.query.userId;
	
	switch(req.method){
	case "GET":
		res.send(await db.comments().get(commentId));
		break;
	case "PUT":
		// auth
		await db.comments().add(new Comment(null, req.body));
		res.send({ ok: true });
		break;
	default: 
		res.status(400).end();
		break;
	}
};