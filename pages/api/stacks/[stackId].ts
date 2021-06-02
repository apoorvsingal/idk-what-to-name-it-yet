import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../lib/db";
import { TechStack, TechStackData, Uid, UserRole } from "../../../lib/data";
import { error, firebase, auth } from "../../../lib/middlewares";

const db = new Database;

const getStack = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const stackId: Uid = req.query.stackId.toString();
	res.send(await db.techStacks().get(stackId));
};

const editStack = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const stackId: Uid = req.query.stackId.toString();
	const data: TechStackData = req.body;
	
	await db.techStacks().save(new TechStack(stackId, data));
	res.send({ ok: true });	
};

export default error(firebase(auth(
	async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
		switch(req.method){
		case "GET":
			return await getStack(req, res, context);
		case "POST":
			return await editStack(req, res, context);
		}
		res.status(400).end();
	},
	{
		minRole: UserRole.ADMIN,
		fullUserContext: true
	}
)));