import { Uid, Database, User } from "../../../lib/db";

const db = new Database;

export default async (req, res) => {
	await db.init();
	const userId: Uid = req.query.userId;

	switch(req.method){
	case "GET":
		res.send(await db.projects().get(userId));
		break;
	case "PUT":
		// auth
		await db.users().save(new User(userId, req.body));
		res.send({ ok: true });
		break;
	default: 
		res.status(400).end();
		break;
	}
};