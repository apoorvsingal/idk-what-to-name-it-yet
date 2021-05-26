import { NextApiRequest, NextApiResponse } from "next";
import { Uid, Database, Comment, CommentData } from "../../../lib/db";
import { error, firebase, auth } from "../../../lib/middlewares";
import admin from "../../../lib/firebase/admin";

const db = new Database;

const getComment = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const commentId: Uid = req.query.commentId.toString();
	res.send(await db.comments().get(commentId));
};

const editComment = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const commentData: CommentData = req.body;
	const comment: Comment = context.comment;

	comment.data.edits.push({ 
		comment: comment.data.comment, 
		timestamp: comment.data.timestamp
	});
	comment.data.comment = commentData.comment;
	comment.data.timestamp = new Date;

	await db.comments().save(comment);
	res.send({ ok: true });
};

const deleteComment = async (req: NextApiRequest, res: NextApiResponse, context?: any) => {
	const commentId: Uid = req.query.commentId.toString();
	await db.comments().delete(commentId);
};

export default error(firebase(auth(
	async (req: NextApiRequest, res: NextApiResponse, context?: object): Promise<object> => {
		switch(req.method){
		case "GET":
			return void await getComment(req, res, context);
		case "PUT":
			return void await editComment(req, res, context);
		case "DELETE":
			return void await deleteComment(req, res, context);
		}
		res.status(400).end();
	}, {
		validator: async (req: NextApiRequest, res: NextApiResponse, context?: { decodedIdToken: admin.auth.DecodedIdToken }): Promise<object> => {
			if(req.method == "GET"){
				return;
			}
			const commentId: Uid = req.query.commentId.toString();
			const comment = await db.comments().get(commentId);
	
			if(context.decodedIdToken.uid != comment.data.userId){
				throw new Error;
			}
			return { comment };
		}
	}
)));