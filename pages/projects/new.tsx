import { GetServerSidePropsContext } from "next";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import { Listbox } from "@headlessui/react";
import Image from "next/image";
import { ProjectType, TechStack, User } from "../../lib/data";
import { Database } from "../../lib/db";
import { AuthHandler } from "../../lib/auth/server";
import Head from "next/head";
import Navbar from '../components/navbar.tsx';

const validateForm = () => {
	return {};
};

const NewProjectPage = function ({ user, stacks }: { user: User, stacks: TechStack[] }) {
	const projectTypes = [];
	console.log(stacks);

	const onSubmit = () => {

	};

	return (
		<main className="bg-primary text-lg text-secondary w-full h-screen">
			<Head>
				<title>Kaow - New Project</title>
			</Head>
			<Formik
				initialValues={{
					description: '',
					url: '',
					stack: stacks[0] as TechStack | null,
					projectType: null as ProjectType | null
				} as any}
				validate={validateForm as any}
				onSubmit={onSubmit}
			>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
					<Form className="flex flex-col p-6 m-auto sm:max-w-3xl w-full">
						<h1 className="sm:text-5xl py-3 mb-6 text-3xl">New Project</h1>
						<Field name="stack" className="flex items-center justify-center">
							{({ field }: FieldProps) => (
								<Listbox {...field} as="div">
									<span className="flex flex-row mb-2 items-center">
										<Listbox.Label className="mt-0.5">Choose Stack</Listbox.Label>
										<div className="flex flex-col justify-center items-center block w-max absolute ml-32 sm:top-14 sm:mt-16 top-11 mt-16">
											<Listbox.Button className="bg-secondaryDark text-primary py-1 px-3 text-base hover:secondaryPrimaryDark transition duration-700 ease-out focus:outline-none disabled:opacity-50 outline-none">{field.value && field.value.data.name}</Listbox.Button>
											<Listbox.Options className="block cursor-pointer bg-secondaryDark text-primary py-1 px-3 text-base hover:secondaryPrimaryDark transition duration-700 ease-out focus:outline-none disabled:opacity-50 outline-none hover:bg-secondaryDark transition duration-500 ease-out">
												{stacks.map(stack => (
													<Listbox.Option
														key={stack.uid}
														value={stack}
													>
														{stack.data.name}
													</Listbox.Option>
												))}
											</Listbox.Options>
										</div>
									</span>
								</Listbox>
							)}
						</Field>
						<ErrorMessage name="stack" />

						<Field name="projectType">
							{({ field }: FieldProps) => (
								<Listbox {...field} as="div">
									<Listbox.Label>Choose Project</Listbox.Label>
									<Listbox.Button>{field.value && field.value.data.name}</Listbox.Button>
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

						<h2 className="text-base font-medium py-1.5">Description:</h2>
						<ErrorMessage name="description">
							{msg => <div className="text-xs">{msg}</div>}
						</ErrorMessage>
						<Field name="description" type="text" className="text-primary p-1 pl-1.5 mb-1 bg-secondaryDark block w-full max-w-lg rounded outline-none border-2 border-secondaryDark focus:border-secondaryPrimary transition duration-300 ease-out " />

						<h2 className="text-base font-medium py-1.5">Url:</h2>
						<ErrorMessage name="url">
							{msg => <div className="text-xs">{msg}</div>}
						</ErrorMessage>
						<Field name="url" type="text" className="text-primary p-1 pl-1.5 mb-4 bg-secondaryDark block w-full max-w-lg rounded outline-none border-2 border-secondaryDark focus:border-secondaryPrimary transition duration-300 ease-out" />

						<button type="submit" className="bg-secondaryPrimary text-secondary flex w-max py-2 px-6 rounded-md mt-2 text-lg hover:secondaryPrimaryDark transition duration-700 ease-out outline-none disabled:opacity-50" disabled={isSubmitting}>Submit</button>
					</Form>
				)}
			</Formik>
		</main>
	)
};

const db = new Database;
const authHandler = new AuthHandler;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
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