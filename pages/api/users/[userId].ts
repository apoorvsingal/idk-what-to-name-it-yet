import { NextApiRequest, NextApiResponse } from "next";
import { AuthHandler } from "../../../lib/auth/server";
import { Uid } from "../../../lib/data";
import { error, firebase, auth } from "../../../lib/middlewares";

const authHandler: AuthHandler = new AuthHandler;

const getUser = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const userId: Uid = req.query.userId.toString();
	res.send(await authHandler.getUser(userId));
};

const addUser = async (req, NextApiRequest, res: NextApiResponse, context?: any) => {
	
};

export default error(firebase(auth(
	async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
		switch(req.method){
		case "GET":
			// return await getUser(req, res, context);
		case "POST":
			// return await addUser(req, res, context);
		}
		res.status(400).end();
	}, {
		validate: async (req: NextApiRequest, res: NextApiResponse, context?: any) => {

		}
	}
)));