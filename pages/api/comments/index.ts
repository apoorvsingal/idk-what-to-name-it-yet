import { Uid, Database, Project, Comment } from "../../../lib/db";

const db = new Database;

export default async (req, res) => {
	await db.init();
	
	const projectId: Uid = req.query.projectId;
	const userId: Uid = req.query.userId;

	switch(req.method){
	case "GET":
		const query = [];

		if(projectId){
			query.push(["projectId", "==", projectId]);
		}
		if(userId){
			query.push(["userId", "==", userId]);
		}
		res.send(await db.projects().find(query, { offset: Number(req.query.offest), limit: Number(req.query.limit) }));
		break;
	case "POST":
		await db.comments().add(new Comment(null, req.body));
		res.status(200).end();
		break;
	default:
		res.status(400).end();
		break;
	}
};