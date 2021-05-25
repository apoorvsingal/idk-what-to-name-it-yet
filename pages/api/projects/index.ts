import { Database, Project, Uid } from "../../../lib/db";

const db = new Database;

export default async (req, res) => {
	await db.init();
	
	const projectTypeId: Uid = req.query.projectTypeId;
	const userId: Uid = req.query.userId;

	switch(req.method){
	case "GET":
		const query = [];

		if(projectTypeId){
			query.push(["projectTypeId", "==", projectTypeId]);
		}
		if(userId){
			query.push(["userId", "==", userId]);
		}
		res.send(await db.projects().find(query, { offset: Number(req.query.offest), limit: Number(req.query.limit) }));
		break;
	case "POST":
		await db.projects().add(new Project(null, req.body));
		res.status(200).end();
		break;
	default:
		res.status(400).end();
		break;
	}
};