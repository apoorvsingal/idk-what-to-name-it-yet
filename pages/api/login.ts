import { AuthHandler } from "../../lib/auth/server";
import { serialize } from "cookie";

const auth = new AuthHandler;

export default async (req, res) => {
	try {
		await auth.init();

		const idToken: string = req.body.idToken;
		const sessionCookie = await auth.getSessionCookie(idToken);
		
		res.setHeader("Set-Cookie", serialize("session", sessionCookie.cookie, { maxAge: sessionCookie.maxAge, httpOnly: true, secure: false, path: "/" }));
		res.send({ ok: true });
	} catch(err){
		console.error(err);
		res.send({ error: err.message });
	}
};