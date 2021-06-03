import { useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikBag } from "formik";
import { TechStack, User, UserRole } from "../../lib/data";
import { Database } from "../../lib/db";
import { AuthHandler } from "../../lib/auth/server";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
type FormValues = {
	icon: File | null,
	name: string,
	desctiption: string
};
type NewStackPageProps = {
	user: User,
	stacks: TechStack[]
}
const validateForm = () => {
	return {};
};

const NewProjectPage = function ({ user, stacks }: NewStackPageProps) {
	const onSubmit = (values: FormValues) => {

	};

	return (
		<>
			<Head>
				<title>Kaow - New</title>
			</Head>
			<main className="bg-primary text-secondary w-full h-screen">
				<Formik
					initialValues={{ icon: null, name: '', description: '' } as any}
					validate={validateForm as any}
					onSubmit={onSubmit}
				>
					{({ isSubmitting }) => (
						<Form className="flex flex-col flex-1 w-max p-6 m-auto">
							<h2 className="text-base font-medium">Icon:</h2>
							<ErrorMessage name="icon">
								{msg => <div className="text-xs text-secondaryPrimaryLight">{msg}</div>}
							</ErrorMessage>
							<Field name="icon" type="image" />

							<h2 className="text-base font-medium">Name:</h2>
							<ErrorMessage name="icon">
								{msg => <div className="text-xs">{msg}</div>}
							</ErrorMessage>
							<Field name="name" type="text" className="text-primary p-1 pl-1.5 mb-4 bg-secondaryDark block w-full rounded outline-none border border-secondaryDark focus:border-secondaryPrimary transition duration-300 ease-out" />

							<h2 className="text-base font-medium">Description:</h2>
							<ErrorMessage name="icon">
								{msg => <div className="text-xs">{msg}</div>}
							</ErrorMessage>
							<Field name="description" type="text" className="text-primary p-1 pl-1.5 mb-4 bg-secondaryDark block w-full rounded outline-none border border-secondaryDark focus:border-secondaryPrimary transition duration-300 ease-out" />

							<button type="submit" className="bg-secondaryPrimary text-secondary flex mx-auto py-2 px-6 rounded-md mt-8 mb-4 text-lg hover:secondaryPrimaryDark transition duration-700 ease-out outline-none disabled:opacity-50" disabled={isSubmitting}>Submit</button>
						</Form>
					)}
				</Formik>
			</main>
		</>
	);
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
	const db = new Database;
	const authHandler = new AuthHandler;

	const sessionCookie: string = req.cookies.session;

	if (!sessionCookie) {
		return { redirect: { destination: "/login", permamnent: false } };
	}
	try {
		await authHandler.init();

		const { uid } = await authHandler.verifySessionCookie(sessionCookie);
		const user = await authHandler.getUser(uid);

		if(user.role < UserRole.ADMIN){
			throw new Error;
		}
		return { props: { user } };
	} catch (error) {
		console.error(error);
		return { redirect: { destination: "/login", permamnent: false } };
	}
};

export default NewProjectPage;