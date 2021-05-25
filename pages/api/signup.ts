import { AuthHandler, NewUser } from "../../lib/auth/server";

const auth = new AuthHandler;

export default async (req, res) => {
	await auth.init();

	const user: NewUser = req.body;
	const { idToken } = req.cookies;

	await auth.createUser(idToken, user);
	res.status(200).end();
};