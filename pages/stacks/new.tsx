import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TechStack, User } from "../../lib/data";
import { Database } from "../../lib/db";
import { AuthHandler } from "../../lib/auth/server";

const validateForm = () => {
	return {};
};

const NewProjectPage = function ({ user, stacks }: { user: User, stacks: TechStack[] }) {
	const onSubmit = (values) => {

	};

	return (
		<main className="bg-darkBlue text-white w-screen h-screen">
			<Formik
				initialValues={{ icon: null, name: '', description: '' } as any}
				validate={validateForm as any}
				onSubmit={onSubmit}
			>
				{({ values, handleChange, handleSubmit, isSubmitting }) => (
					<Form>
						Icon:
					<ErrorMessage name="icon" />
						<Field name="icon" type="image" value={values.icon} onChange={handleChange} />
						<br />

						Name:
					<ErrorMessage name="icon" />
						<Field name="name" type="text" value={values.name} onChange={handleChange} />
						<br />

						Description:
					<ErrorMessage name="icon" />
						<Field name="description" type="text" value={values.description} onChange={handleChange} />
						<br />

						<button type="submit" disabled={isSubmitting}>Submit</button>
					</Form>
				)}
			</Formik>
		</main>
	);
};

export const getServerSideProps = async function ({ req }) {
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