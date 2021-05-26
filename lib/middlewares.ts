import { NextApiRequest, NextApiResponse } from "next";
import { AuthHandler } from "./auth/server";
import admin, { credential } from "./firebase/admin";

export type MiddlewareCallback = (req: NextApiRequest, res: NextApiResponse, context?: any) => Promise<object>;

const authHandler: AuthHandler = new AuthHandler;

export const error = (callback: MiddlewareCallback) => {
	return async (req: NextApiRequest, res: NextApiResponse, context?: any): Promise<object> => {
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
	return async (req: NextApiRequest, res: NextApiResponse, context?: any): Promise<object> => {
		if(admin.apps.length < 1){
			await admin.initializeApp({ credential });
		}
		return await callback(req, res, context);
	};
};

export const auth = (callback: MiddlewareCallback, options?: { validator?: MiddlewareCallback }) => {
	return async (req: NextApiRequest, res: NextApiResponse, context: any = {}): Promise<object> => {
		if(req.method == "GET"){
			return await callback(req, res, context);
		}
		try {
			context.decodedIdToken = await authHandler.verifySessionCookie(req.cookies.session);
			
			if(options.validator) {
				context = { ...context, ...(await options.validator(req, res, context) || {})};
			}
		} catch(error){
			res.status(401).send({ error: "Unauthorized" });
			return {};
		}
		return await callback(req, res, context);
	};
};