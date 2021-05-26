import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../lib/db";
import { Uid, Project, ProjectData, ProjectType } from "../../../lib/data";
import { auth, error, firebase } from "../../../lib/middlewares";

const db = new Database;

const getProjects = async(req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const projectTypeId: Uid = req.query.projectTypeId.toString();
	const userId: Uid = req.query.userId.toString();

	const offset: number = req.query.offset ? Number(req.query.offset) : 0;
	const limit: number = req.query.limit ? Number(req.query.limit) : 10;

	const query = [];

	if(projectTypeId){
		query.push(["projectTypeId", "==", projectTypeId]);
	}
	if(userId){
		query.push(["userId", "==", userId]);
	}
	res.send(await db.projects().find(query, { offset, limit }));
};

const addProject = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const projectData: ProjectData = req.body;

	await db.projects().add(new Project(null, projectData));
	res.send({ ok: true });
};

export default error(firebase(auth(
	async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
		switch(req.method){
		case "GET":
			return await getProjects(req, res, context);
		case "POST":
			return await addProject(req, res, context);
		}
		res.status(400).end();
	}, {
		validate: async(req: NextApiRequest, res: NextApiResponse, context?: any) => {
			const projectData: ProjectData = req.body;
			
			if(projectData.userId != context.decodedIdToken.uid){
				throw new Error;
			}
			const projectType: ProjectType = await db.projectTypes().get(projectData.projectTypeId);
			context.projectType = projectType;
		}
	}
)));