import { NextApiRequest, NextApiResponse } from "next";
import { AuthHandler } from "./auth/server";
import { UserRole } from "./data";
import admin, { credential } from "./firebase/admin";

export type MiddlewareCallback = (req: NextApiRequest, res: NextApiResponse, context?: any) => Promise<void>;

const authHandler: AuthHandler = new AuthHandler;

export const error = (callback: MiddlewareCallback) => async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	try {
		await callback(req, res, context);
	} catch(error){
		console.error(error);
		res.send({ error: error.message });
	}
	return;
};

export const firebase = (callback: MiddlewareCallback) => async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	if(admin.apps.length < 1){
		await admin.initializeApp({ credential });
	}
	await callback(req, res, context);
};

type AuthMiddlewareOptions = { validate?: MiddlewareCallback, fullUserContext?: boolean, minRole?: UserRole };

export const auth = (callback: MiddlewareCallback, options: AuthMiddlewareOptions = {}) => async (req: NextApiRequest, res: NextApiResponse, context: any = {}) => {
	if(req.method == "GET"){
		await callback(req, res, context);
	}
	try {
		context.decodedIdToken = await authHandler.verifySessionCookie(req.cookies.session);

		if(options.fullUserContext){
			context.user = await authHandler.getUser(context.decodedIdToken.uid);
		}
		if(options.validate) {
			await options.validate(req, res, context);
		}
		if(options.minRole && options.minRole < (context.user || await authHandler.getUser(context.decodedIdToken.uid)).role){
			throw new Error;
		}
	} catch(error){
		return res.status(401).send({ error: "Unauthorized" });
	}
	await callback(req, res, context);
};