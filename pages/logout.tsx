import { serialize } from "cookie";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

const LogoutPage = function(){
	return <>null</>;
}

export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
	res.setHeader("Set-Cookie", serialize("session", "", { path: "/" }));
	return { redirect: { destination: "/login", permanent: false } };
};

export default LogoutPage;