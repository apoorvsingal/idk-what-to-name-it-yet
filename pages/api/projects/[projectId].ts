import { Uid, Database, Project } from "../../../lib/db";

const db = new Database;

export default async (req, res) => {
	await db.init();
	const projectId: Uid = req.query.projectId;
	const userId: Uid = req.query.userId;
	
	switch(req.method){
	case "GET":
		res.send(await db.projects().get(projectId));
		break;
	case "PUT":
		// auth
		await db.projects().save(new Project(projectId, req.body));
		res.send({ ok: true });
		break;
	default: 
		res.status(400).end();
		break;
	}
};