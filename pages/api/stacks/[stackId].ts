import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../lib/db";
import { Uid } from "../../../lib/data";
import { error, firebase, auth } from "../../../lib/middlewares";

const db = new Database;

const getStack = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const stackId: Uid = req.query.stackId.toString();
	res.send(await db.techStacks().get(stackId));
};

const addStack = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	
};

export default error(firebase(auth(
	async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
		switch(req.method){
		case "GET":
			return await getStack(req, res, context);
		case "POST":
			return await addStack(req, res, context);
		}
		res.status(400).end();
	}, {
		validate: async (req: NextApiRequest, res: NextApiResponse, context?: any) => {

		}
	}
)));