import { NextApiRequest, NextApiResponse } from "next";
import { Database, ProjectType, Uid } from "../../../lib/db";
import { auth, error, firebase } from "../../../lib/middlewares";

const db = new Database;

const getProjectTypes = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const stackId: Uid = req.query.stackId.toString();
	
	const offset: number = req.query.offset ? Number(req.query.offset) : 0;
	const limit: number = req.query.limit ? Number(req.query.limit) : 10;

	const query = [];

	if(stackId){
		query.push(["stackId", "==", stackId]);
	}
	res.send(await db.projectTypes().find(query, { offset, limit }));
};

const addProjectType = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {

};

export default error(firebase(auth(
	async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
		switch(req.method){
		case "GET":
			return await getProjectTypes(req, res, context);
		case "POST":
			// return await addProjectType(req, res, context);
		}
		res.status(400).end();
	}, {
		validate: async(req: NextApiRequest, res: NextApiResponse, context?: any) => {

		}
	}
)));