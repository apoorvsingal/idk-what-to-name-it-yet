import { Database, ProjectType } from "../../../lib/db";

const db = new Database;

export default async (req, res) => {
	await db.init();
	const projectTypeId: string = req.query.projectTypeId;

	switch(req.method){
	case "GET":
		res.send(await db.projectTypes().get(projectTypeId));
		break;
	case "PUT":
		// auth
		await db.projectTypes().save(new ProjectType(projectTypeId, req.body));
		res.send({ ok: true });
		break;
	default: 
		res.status(400).end();
		break;
	}
};