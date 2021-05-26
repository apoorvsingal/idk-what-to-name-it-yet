import { AuthHandler } from "../../../lib/auth/server";
import { Uid, Database, Project, ProjectData } from "../../../lib/db";

const db = new Database;
const auth = new AuthHandler;

const getProject = async (req, res) => {
	const projectId: Uid = req.query.projectId;
	res.send(await db.projects().get(projectId));
};

const addProject = async (req, res) => {
	const projectId: Uid = req.query.projectId;
	const projectData: ProjectData = req.body;
	const sessionCookie: string = req.cookies.session;

	let project: Project;

	try {
		const { uid: userId } = await auth.verifySessionCookie(sessionCookie);
		project = await db.projects().get(projectId);

		if(userId != projectData.userId || userId != project.data.userId){
			throw new Error;
		}
	} catch(error){
		return res.status(401).send({ error: "Unauthorized" });
	}
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

export default async (req, res) => {
	try {
		await db.init();

		switch(req.method){
		case "GET":
			return await getProject(req, res);
		case "PUT":
			return await addProject(req, res);
		}
		res.status(400).end();
	} catch(error){
		console.error(error);
		res.status(500).send({ error: error.message });
	}
};