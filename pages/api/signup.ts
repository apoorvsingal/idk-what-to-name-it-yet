import { Database } from "../../lib/db";
import { AuthHandler, NewUser } from "../../lib/auth";

const auth = new AuthHandler;

export default async (req, res) => {
	await auth.init();
	const user: NewUser = req.body;

	res.send("ok");
};