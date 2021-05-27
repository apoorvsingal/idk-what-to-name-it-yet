import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Listbox } from '@headlessui/react'
import { ProjectType, TechStack, User } from "../../lib/data";
import { Database } from "../../lib/db";
import { AuthHandler } from "../../lib/auth/server";
import Image from "next/image";

const validateForm = () => {
	return {};
};

const NewProjectPage = function ({ user, stacks }: { user: User, stacks: TechStack[] }) {
	const projectTypes = [];
	console.log(stacks);

	const onSubmit = () => {

	};

	return (
		<main className="bg-darkBlue text-white w-screen h-screen">
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
					<Form>
						<Listbox value={values.stack} onChange={handleChange}>
							<Listbox.Button>{values.stack}</Listbox.Button>
							<Listbox.Label>Choose Stack</Listbox.Label>
							<Listbox.Options>
								{stacks.map(stack => (
									<Listbox.Option
										key={stack.uid}
										value={stack}
									>
										{stack.data.name}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Listbox>

						<Field name="stack">
							{({ field }) => (
								<Listbox {...field} as="div">
									<Listbox.Label>Choose Stack</Listbox.Label>
									<Listbox.Button>{field.value}</Listbox.Button>
									<Listbox.Options>
										{stacks.map(stack => (
											<Listbox.Option
												key={stack.uid}
												value={stack}
											>
												{stack.data.name}
											</Listbox.Option>
										))}
									</Listbox.Options>
								</Listbox>
							)}
						</Field>
						<ErrorMessage name="stack" />

						<Field name="projectType">
							{({ field }) => (
								<Listbox {...field} as="div">
									<Listbox.Label>Choose Project</Listbox.Label>
									<Listbox.Button>{field.value}</Listbox.Button>
									<Listbox.Options>
										{stacks.map(stack => (
											<Listbox.Option
												key={stack.uid}
												value={stack}
											>
												<Image src={stack.data.icon} height="100%" width="100%" />
												<div>
													<div>{stack.data.name}</div>
													<div>{stack.data.description}</div>
												</div>
											</Listbox.Option>
										))}
									</Listbox.Options>
								</Listbox>
							)}
						</Field>
						<ErrorMessage name="projectType" />

						Description:
					<ErrorMessage name="description" />
						<Field name="description" type="text" />

						Url:
					<ErrorMessage name="url" />
						<Field name="url" type="text" />

						<button type="submit" disabled={isSubmitting}>Submit</button>
					</Form>
				)}
			</Formik>
		</main>
	);
};

const db = new Database;
const authHandler = new AuthHandler;

export const getServerSideProps = async function ({ req }) {
	const sessionCookie: string = req.cookies.session;

	if (!sessionCookie) {
		return { redirect: { destination: "/login", permamnent: false } };
	}
	try {
		await authHandler.init();
		const stacksProm = db.techStacks().find([]);

		const { uid } = await authHandler.verifySessionCookie(sessionCookie);
		const user = await authHandler.getUser(uid);

		console.log(await stacksProm);
		return { props: { user, stacks: (await stacksProm).map(e => ({ ...e })) } };
	} catch (error) {
		console.error(error);
		return { redirect: { destination: "/login", permamnent: false } };
	}
};

export default NewProjectPage;