import { AuthHandler } from "../../lib/auth";

const auth = new AuthHandler;

export default async (req, res) => {
	await auth.init();
	
	const idToken: string = req.cookies.idToken;
	const crsfToken: string = req.cookies.crsfToken;

	
	res.send("ok");
};