import { AuthHandler } from "../../lib/auth/server";

const auth = new AuthHandler;

export default async (req, res) => {
	try {
		await auth.init();
	
		const idToken: string = req.cookies.idToken;
		const sessionCookie = await auth.getSessionCookie(idToken);
		
		res.cookie("session", sessionCookie.cookie, { maxAge: sessionCookie.maxAge, httpOnly: true, secure: true });
		res.send({ ok: true });
	} catch(err){
		console.error(err);
		res.send({ error: err.message });
	}
};