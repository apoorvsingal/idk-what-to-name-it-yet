import { AuthHandler } from "../lib/auth/server";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { User, UserInfo } from "../lib/data";
import Head from "next/head";
type ProfilePageProps = {
	user: UserInfo
}

const ProfilePage = function ({ user }: ProfilePageProps) {
	return (
		<>
			<Head>
				<title>Kaow - { user.username }</title>
			</Head>
			<main className="bg-primary text-lg text-secondary w-full h-screen">
				<div className="w-full p-6 sm:p-8 bg-secondaryDark flex flex-row items-start text-primary shadow-lg">
					<span className="flex sm:flex-row">
						<Image
							src={user.photoURL || "https://media.discordapp.net/attachments/815202642006507590/847062656077791242/unknown.png"}
							height="100%"
							width="100%"
							className="rounded-full shadow-sm"
						/>
						<span className="px-5">
							<div className="font-thin text-primary mb-0.5">{user.displayName}</div>
							<div className="font-medium text-2xl mb-1.5 md:text-3xl">@{user.username}</div>
							<div className="font-light text-primary">{user.bio}</div>
						</span>
					</span>
				</div>
			</main>
		</>
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

		try {
			return { props: { user: await authHandler.getUser(uid) } };
		} catch (error) {
			return { redirect: { destination: "/signup?next=true", permanent: false } };
		}
	} catch (error) {
		console.error(error);
		return { redirect: { destination: "/login", permamnent: false } };
	}
};

export default ProfilePage;