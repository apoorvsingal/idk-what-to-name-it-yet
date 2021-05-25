import { Database, User } from "../../../lib/db";

const db = new Database;

export default async (req, res) => {
	await db.init();

	switch(req.method){
	case "GET":
		res.send(await db.users().find([], { offset: Number(req.query.offest), limit: Number(req.query.limit) }));
		break;
	case "POST":
		// auth
		await db.users().add(new User(null, req.body));
		res.status(200).end();
		break;
	default:
		res.status(400).end();
		break;
	}
};