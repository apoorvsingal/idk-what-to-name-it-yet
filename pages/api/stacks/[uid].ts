import { Database, TechStack } from "../../../lib/db";

const db = new Database;

export default async (req, res) => {
	await db.init();
	const uid: string = req.query.uid;

	switch(req.method){
	case "GET":
		res.send(await db.techStacks().get(uid));
		break;
	case "PUT":
		// auth
		await db.techStacks().save(new TechStack(uid, req.body));
		res.send({ ok: true });
		break;
	default: 
		res.status(400).end();
		break;
	}
};