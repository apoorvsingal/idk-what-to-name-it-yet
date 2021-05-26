import React, { useState } from "react";
import { Formik } from "formik";
import { Listbox } from '@headlessui/react'
import { ProjectType, TechStack, User } from "../../lib/data";
import { Database } from "../../lib/db";
import { AuthHandler } from "../../lib/auth/server";
import Image from "next/image";

const validateForm = () => {

};

const NewProjectPage = function({ user, stacks }: { user: User, stacks: TechStack[] }){
	const onSubmit = () => {

	};

	return (
		<Formik
			initialValues={{
				description: '',
				url: '',
				stack: null as TechStack,
				projectType: null as ProjectType
			} as any}
			validate={validateForm as any}
			onSubmit={onSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
				<>
					<Listbox value={values.stack} onChange={handleChange}>
						<Listbox.Label>Choose Stack:</Listbox.Label>
						<Listbox.Button>{values.stack}</Listbox.Button>
						<Listbox.Options>
							{stacks.map(stack => (
								<Listbox.Option
									key={stack.uid}
									value={stack}
								>
									{({ active, selected } : { active: boolean, selected: boolean }) => (
										<span>{stack.data.name}</span>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Listbox>
					{errors.stack && touched.stack && errors.stack}

					<Listbox value={values.projectType} onChange={handleChange}>
						<Listbox.Label>Choose Project:</Listbox.Label>
						<Listbox.Button>{values.seletedStack}</Listbox.Button>
						<Listbox.Options>
							{stacks.map(stack => (
								<Listbox.Option
									key={stack.uid}
									value={stack}
								>
									{({ active, selected } : { active: boolean, selected: boolean }) => (
										<>
											<Image src={stack.data.icon} height="100%" width="100%"/>
											<div>
												<div>{stack.data.name}</div>
												<div>{stack.data.description}</div>
											</div>
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Listbox>

					Description:
					{errors.description && touched.description && errors.description}
					<input name="description" type="text" value={values.description}/>

					Url:
					{errors.url && touched.url && touched.url}
					<input name="url" type="text" value={values.url}/>
				</>
			)}
		</Formik>
	);
};

const db = new Database;
const authHandler = new AuthHandler;

export const getServerSideProps = async function({ req }){
	const sessionCookie: string = req.cookies.session;
	
	if(!sessionCookie){
		return { redirect: { destination: "/login", permamnent: false } };
	}
	try {
		await authHandler.init();
		const stacksProm = db.techStacks().find([]);

		const { uid } = await authHandler.verifySessionCookie(sessionCookie);
		const user = await authHandler.getUser(uid);

		return { props: { user, stacks: await stacksProm } };
	} catch(error){
		console.error(error);
		return { redirect: { destination: "/login", permamnent: false } };
	}
};

export default NewProjectPage;