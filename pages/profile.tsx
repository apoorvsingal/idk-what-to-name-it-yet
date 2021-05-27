import { AuthHandler } from "../lib/auth/server";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { User, UserInfo } from "../lib/data";

type ProfilePageProps = {
	user: UserInfo
}

const ProfilePage = function ({ user }: ProfilePageProps){
	return (
		<main className="bg-darkBlue text-white w-screen h-screen">
			<div className="w-full p-6 bg-white flex flex-row items-center mt-0 text-darkBlue">
				<span>
					<Image
						src={user.photoURL || "https://media.discordapp.net/attachments/815202642006507590/847062656077791242/unknown.png"}
						height="100%"
						width="100%"
					/>
					<span className="text-lightGray p-2">
						<div>{user.displayName}</div>
						<div>@{user.username}</div>
						<div>{user.bio}</div>
					</span>
				</span>
			</div>
		</main>
	)
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
	const authHandler = new AuthHandler;
	const sessionCookie: string = req.cookies.session;

	if (!sessionCookie) {
		return { redirect: { destination: "/login", permamnent: false } };
	}
	try {
		await authHandler.init();

		const { uid } = await authHandler.verifySessionCookie(sessionCookie);
		const user = await authHandler.getUser(uid);

		return { props: { user } };
	} catch (error) {
		console.error(error);
		return { redirect: { destination: "/login", permamnent: false } };
	}
};

export default ProfilePage;