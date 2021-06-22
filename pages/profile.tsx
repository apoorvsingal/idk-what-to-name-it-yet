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
							<div className="font-thin text-primary text-md mb-0.5">{user.displayName}</div>
							<div className="font-medium text-2xl mb-1.5 md:text-3xl">@{user.username}</div>
							<div className="font-light text-primary text-md">{user.bio}</div>
						</span>
					</span>
				</div>
				// Projects wrap
				<section className="flex flex-row justify-evenly p-2 overflow-x-auto">
					// if user has no projects
					<div className="w-full h-full flex justify-center align-center">
					// kaka make this work :rage: uwu i assume it has some fancy ts stuff and the uwu
						<p className="font-semibold text-md text-primaryDark">User has no projects.</p>
						// card for projects this only basic styling idk if there are thumbnails or smth so this kinda just like a container might also be description so kinda mhm
						// Lily :rage:
						<div className="rounded-md p-6 bg-secondaryDark">
							// in case description mhm
							// Need to add a character limit on the card :thonkexplode:
							// also is this going on commit history? help git is holding me captive :pensive:
							<p className="text-sm text-primaryDark py-2 font-medium overflow-ellipsis"></p>
						</div>
					</div>
				</section>
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