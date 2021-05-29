import { useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikBag } from "formik";
import { TechStack, User } from "../../lib/data";
import { Database } from "../../lib/db";
import { AuthHandler } from "../../lib/auth/server";
import { GetServerSidePropsContext } from "next";

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
		<main className="bg-bg text-white w-full h-screen">
			<Formik
				initialValues={{ icon: null, name: '', description: '' } as any}
				validate={validateForm as any}
				onSubmit={onSubmit}
			>
				{({ isSubmitting }) => (
					<Form className="flex flex-col flex-1 max-w-lg p-6">
						Icon:
						<ErrorMessage name="icon" />
						<Field name="icon" type="image" />

						Name:
						<ErrorMessage name="icon">
							{msg => <div className="text-xs">{msg}</div>}
						</ErrorMessage>
						<Field name="name" type="text" className="p-1 pl-1.5 bg-snow block w-9/12 rounded outline-none border border-snow focus:border-lightPurple transition duration-300 ease-out" />

						Description:
						<ErrorMessage name="icon">
							{msg => <div className="text-xs">{msg}</div>}
						</ErrorMessage>
						<Field name="description" type="text" className="p-1 pl-1.5 bg-snow block w-9/12 rounded outline-none border border-snow focus:border-lightPurple transition duration-300 ease-out" />

						<button type="submit" className="bg-gradient-to-b from-lightPurple to-purple text-white py-2 px-6 rounded-md my-6 text-lg hover:from-purple hover:to-lightPurple transition duration-700 ease-out outline-none m-auto" disabled={isSubmitting}>Submit</button>
					</Form>
				)}
			</Formik>
		</main>
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

		return { props: { user } };
	} catch (error) {
		console.error(error);
		return { redirect: { destination: "/login", permamnent: false } };
	}
};

export default NewProjectPage;