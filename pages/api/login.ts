import { AuthHandler } from "../../lib/auth/server";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { error, firebase } from "../../lib/middlewares";

const auth = new AuthHandler;

export default error(firebase(async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await auth.init();

		const idToken: string = req.body.idToken;
		const sessionCookie = await auth.getSessionCookie(idToken);
		
		res.setHeader("Set-Cookie", serialize("session", sessionCookie.cookie, { maxAge: sessionCookie.maxAge, httpOnly: true, secure: process.env.NODE_ENV == "production", path: "/" }));
		res.send({ ok: true });
	} catch(err){
		console.error(err);
		res.send({ error: err.message });
	}
}));