import { Database } from "../../../lib/db";
import { Uid, Comment, CommentData, Project } from "../../../lib/data";
import { NextApiRequest, NextApiResponse } from "next";
import { auth, firebase, error } from "../../../lib/middlewares";

const db = new Database;

const getComments = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const projectId: Uid = req.query.projectId.toString();
	const userId: Uid = req.query.userId.toString();

	const offset: number = req.query.offset ? Number(req.query.offset) : 0;
	const limit: number = req.query.limit ? Number(req.query.limit) : 10;

	const query = [];

	if(projectId){
		query.push(["projectId", "==", projectId]);
	}
	if(userId){
		query.push(["userId", "==", userId]);
	}
	res.send(await db.comments().find(query, { offset, limit }));
};

const addComment = async (req, res, context?: any) => {
	const commentData: CommentData = req.body;

	await db.comments().add(new Comment(null, commentData));
	res.send({ ok: true });
};

export default error(firebase(auth(
	async (req: NextApiRequest, res: NextApiResponse, context?: object) => {
		switch(req.method){
		case "GET":
			return await getComments(req, res, context);
		case "POST":
			return await addComment(req, res, context);
		}
		res.status(400).end();
	}, {
		validate: async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
			const commentData: CommentData = req.body;
			
			if(context.decodedIdToken.uid != commentData.userId){
				throw new Error;
			}
			const project: Project = await db.projects().get(commentData.projectId);
			context.project = project;
		}
	}
)));