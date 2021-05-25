import { at } from "core-js/core/string";
import React from "react";
import { AuthHandler } from "../lib/auth/server";

const ProfilePage = function({ user, error }){
	return (
		<div>
			{JSON.stringify({ user, error }, null, 4)}
		</div>
	)
};

const auth = new AuthHandler;

export const getServerSideProps = async function({ req }){
	const sessionCookie: string = req.cookies.session;
	console.log(sessionCookie);
	
	if(!sessionCookie){
		return {
			redirect: {
				destination: "/login",
				permamnent: false
			}
		};
	}
	try {
		await auth.init();
		
		const { uid } = await auth.verifySessionCookie(sessionCookie);
		const user = await auth.getUser(uid);

		return { props: { user } };
	} catch(error){
		console.error(error);
		return { props: { error: error.message }};
	}
};

export default ProfilePage;