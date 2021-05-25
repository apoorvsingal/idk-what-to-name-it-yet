import { AuthHandler, NewUser } from "../../lib/auth/server";

const auth = new AuthHandler;

export default async (req, res) => {
	const { idToken, user }: { idToken: string, user: NewUser } = req.body;

	if(!user.username || typeof user.username != "string" || user.username.length < 3 || user.username.length > 24){
		res.status(400).send({ error: "Invalid username" });
	}
	if(user.bio && (typeof user.bio != "string" || user.bio.length > 128)){
		res.status(400).send({ error: "Invalid bio" });
	}
	try {
		await auth.init();
		await auth.createUser(idToken, user);

		res.send({ ok: true });
	} catch(error){
		console.error(error);
		res.send({ error: error.message });
	}
};