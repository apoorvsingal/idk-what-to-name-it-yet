import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const LogoutPage = function(){
	return <>null</>;
}

export const getServerSideProps = ({ req, res }: { req: NextApiRequest, res: NextApiResponse }) => {
	res.setHeader("Set-Cookie", serialize("session", "", { path: "/" }));
	return { redirect: { destination: "/login", permanent: false } };
};

export default LogoutPage;