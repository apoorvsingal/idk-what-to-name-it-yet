import React from "react";
import { AuthHandler } from "../lib/auth/server";
import Image from "next/image";

const ProfilePage = function({ user, error }){
	return (
		<span>
			<Image 
				src={user.photoURL || "https://media.discordapp.net/attachments/815202642006507590/847062656077791242/unknown.png"}
				height="100%"
				width="100%"
			/>
			<span>
				<div>{user.displayName}</div>
				<div>@{user.username}</div>
				<div>{user.bio}</div>
			</span>
		</span>
	)
};

export const getServerSideProps = async function({ req }){
	const authHandler = new AuthHandler;
	const sessionCookie: string = req.cookies.session;
	
	if(!sessionCookie){
		return { redirect: { destination: "/login", permamnent: false } };
	}
	try {
		await authHandler.init();
		
		const { uid } = await authHandler.verifySessionCookie(sessionCookie);
		const user = await authHandler.getUser(uid);

		return { props: { user } };
	} catch(error){
		console.error(error);
		return { redirect: { destination: "/login", permamnent: false } };
	}
};

export default ProfilePage;