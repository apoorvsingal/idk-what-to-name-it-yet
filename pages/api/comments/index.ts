import { Uid, Database, Comment, CommentData, Project } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { auth, firebase, error } from "../../../lib/middlewares";
import admin from "../../../lib/firebase/admin";

const db = new Database;

const getComment = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const query = [];

	const projectId: Uid = req.query.projectId.toString();
	const userId: Uid = req.query.userId.toString();

	if(projectId){
		query.push(["projectId", "==", projectId]);
	}
	if(userId){
		query.push(["userId", "==", userId]);
	}
	res.send(await db.comments().find(query, { offset: Number(req.query.offest), limit: Number(req.query.limit) }));
};

const addComment = async (req, res, context?: any) => {
	const commentData: CommentData = req.body;
	
	await db.comments().add(new Comment(null, commentData));
	res.send({ ok: true });
};

export default error(firebase(auth(
	async (req: NextApiRequest, res: NextApiResponse, context?: object): Promise<object> => {
		switch(req.method){
		case "GET":
			return void await getComment(req, res, context);
		case "POST":
			return void await addComment(req, res, context);
		}
		res.status(400).end();
	}, {
		validator: async (req: NextApiRequest, res: NextApiResponse, context?: { decodedIdToken: admin.auth.DecodedIdToken }): Promise<object> => {
			if(req.method == "GET"){
				return;
			}
			const commentData: CommentData = req.body;
			const project: Project = await db.projects().get(commentData.projectId);
			return { project };
		}
	}
)));