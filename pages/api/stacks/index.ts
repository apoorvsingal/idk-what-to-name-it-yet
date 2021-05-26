import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../lib/db";
import { error, firebase, auth } from "../../../lib/middlewares";

const db = new Database;

const getStacks = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const offset: number = req.query.offset ? Number(req.query.offset) : 0;
	const limit: number = req.query.limit ? Number(req.query.limit) : 10;

	res.send(await db.techStacks().find([], { offset, limit }));
};

const addStack = async (req, NextApiRequest, res: NextApiResponse, context?: any) => {
	
};

export default error(firebase(auth(
	async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
		switch(req.method){
		case "GET":
			return await getStacks(req, res, context);
		case "POST":
			// return await addStack(req, res, context);
		}
		res.status(400).end();
	}, {
		validate: async (req: NextApiRequest, res: NextApiResponse, context?: any) => {

		}
	}
)));