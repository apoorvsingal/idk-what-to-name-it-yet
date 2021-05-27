import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../lib/db";
import { Uid } from "../../../lib/data";

import { auth, error, firebase } from "../../../lib/middlewares";

const db = new Database;

const getProjectType = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const projectTypeId: Uid = req.query.projectTypeId.toString();
};
const addProjectType = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {

};

export default error(firebase(auth(
	async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
		switch(req.method){
		case "GET":
			return await getProjectType(req, res, context);
		case "PUT":
			// return await addProjectType(req, res, context);
		}
		res.status(400).end();
	}, {
		validate: async(req: NextApiRequest, res: NextApiResponse, context?: any) => {

		}
	}
)));