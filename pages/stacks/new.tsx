import React, { useState } from "react";
import { Formik } from "formik";
import { TechStack, User } from "../../lib/data";
import { Database } from "../../lib/db";
import { AuthHandler } from "../../lib/auth/server";

const validateForm = () => {
	return {};
};

const NewProjectPage = function({ user, stacks }: { user: User, stacks: TechStack[] }){
	const onSubmit = () => {

	};

	return (
		<Formik
			initialValues={{ icon: null, name: '', description: '' } as any}
			validate={validateForm as any}
			onSubmit={onSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
				<div>
					Icon:
					{errors.icon && touched.icon && touched.icon}
					<input name="icon" type="file" value={values.icon} onChange={handleChange}/>
					
					Name:
					{errors.name && touched.name && errors.name}
					<input name="name" type="text" value={values.name} onChange={handleChange}/>
					
					Description:
					{errors.description && touched.description && errors.description}
					<input name="description" type="text" value={values.description} onChange={handleChange}/>

					<button type="submit" disabled={isSubmitting}>Submit</button>
				</div>
			)}
		</Formik>
	);
};

export const getServerSideProps = async function({ req }){
	const db = new Database;
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

export default NewProjectPage;