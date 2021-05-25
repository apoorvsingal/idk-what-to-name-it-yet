import nc from "next-connect";
import express from "express";
import { UserMeta } from "../../lib/db";
import admin from "../../lib/firebase/admin";
import { Database } from "../../lib/db";

const db = new Database;

export default async (req, res) => {
	await db.init();
	const user: NewUser = req.body;

	await admin.auth().createUser(user);
	res.send("ok");
};