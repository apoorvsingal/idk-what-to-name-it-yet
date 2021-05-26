import { NextApiRequest, NextApiResponse } from "next";
import { AuthHandler } from "./auth/server";
import admin, { credential } from "./firebase/admin";

export type MiddlewareCallback = (req: NextApiRequest, res: NextApiResponse, context?: any) => Promise<void>;

const authHandler: AuthHandler = new AuthHandler;

export const error = (callback: MiddlewareCallback) => {
	return async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
		try {
			await callback(req, res, context);
		} catch(error){
			console.error(error);
			res.send({ error: error.message });
		}
		return;
	}
};

export const firebase = (callback: MiddlewareCallback) => {
	return async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
		if(admin.apps.length < 1){
			await admin.initializeApp({ credential });
		}
		await callback(req, res, context);
	};
};

export const auth = (callback: MiddlewareCallback, options?: { validate?: MiddlewareCallback }) => {
	return async (req: NextApiRequest, res: NextApiResponse, context: any = {}) => {
		if(req.method == "GET"){
			await callback(req, res, context);
		}
		try {
			context.decodedIdToken = await authHandler.verifySessionCookie(req.cookies.session);
			
			if(options.validate) {
				await options.validate(req, res, context);
			}
		} catch(error){
			res.status(401).send({ error: "Unauthorized" });
		}
		await callback(req, res, context);
	};
};