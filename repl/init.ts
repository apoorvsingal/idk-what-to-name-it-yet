import { Database } from "../lib/db";
import { AuthHandler } from "../lib/auth/server";
import admin from "../lib/firebase/admin";

const authHandler = new AuthHandler;
const db = new Database;
