import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../lib/db";
import { ProjectType, ProjectTypeData, Uid, UserRole } from "../../../lib/data";

import { auth, error, firebase } from "../../../lib/middlewares";

const db = new Database;

const getProjectType = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const projectTypeId: Uid = req.query.projectTypeId.toString();
};
const editProjectType = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const projectTypeId: Uid = req.query.projectTypeId.toString();
	const data: ProjectTypeData = req.body;
	
	await db.projectTypes().save(new ProjectType(projectTypeId, data));
	res.send({ ok: true });
};

export default error(firebase(auth(
	async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
		switch(req.method){
		case "GET":
			return await getProjectType(req, res, context);
		case "PUT":
			return await editProjectType(req, res, context);
		}
		res.status(400).end();
	}, {
		validate: async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
			if(context.user.role < UserRole.ADMIN){
				throw new Error;
			}
		},
		fullUserContext: true
	}
)));