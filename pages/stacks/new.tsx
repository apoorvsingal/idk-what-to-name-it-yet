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
		<main className="bg-darkBlue text-white w-screen h-screen">
			<Formik
				initialValues={{ icon: null, name: '', description: '' } as any}
				validate={validateForm as any}
				onSubmit={onSubmit}
			>
				{({ isSubmitting }) => (
					<Form>
						Icon:
						<ErrorMessage name="icon"/>
						<Field name="icon" type="image"/>
						<br />

						Name:
						<ErrorMessage name="icon"/>
						<Field name="name" type="text"/>
						<br />

						Description:
						<ErrorMessage name="icon"/>
						<Field name="description" type="text"/>
						<br />

						<button type="submit" disabled={isSubmitting}>Submit</button>
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