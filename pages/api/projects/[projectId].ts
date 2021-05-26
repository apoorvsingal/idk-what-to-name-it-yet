import { NextApiRequest, NextApiResponse } from "next";
import { Uid, Database, Project, ProjectData } from "../../../lib/db";
import { auth, error, firebase } from "../../../lib/middlewares";

const db = new Database;

const getProject = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const projectId: Uid = req.query.projectId.toString();
	res.send(await db.projects().get(projectId));
};

const addProject = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const projectId: Uid = req.query.projectId.toString();
	const projectData: ProjectData = req.body;

	const project: Project = context.project;

	project.data.edits.push({ 
		projectTypeId: project.data.projectTypeId, 
		description: project.data.description,
		timestamp: project.data.timestamp,
		url: project.data.url
	});

	project.data.projectTypeId = projectData.projectTypeId;
	project.data.description = projectData.description;
	project.data.url = projectData.url;
	project.data.timestamp = new Date;

	await db.projects().save(project);
	res.send({ ok: true });
};

export default error(firebase(auth(
	async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
		switch(req.method){
		case "GET":
			return await getProject(req, res, context);
		case "PUT":
			return await addProject(req, res, context);
		}
		res.status(400).end();
	},
	{
		validate: async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
			const projectId = req.query.projectId.toString();
			const project: Project = await db.projects().get(projectId);

			if(project.data.userId != context.decodedIdToken.uid){
				throw new Error;
			}
			context.project = project;
		}
	}
)));
