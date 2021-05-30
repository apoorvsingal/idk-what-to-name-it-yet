import { GetServerSidePropsContext } from "next";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import { Listbox } from "@headlessui/react";
import Image from "next/image";

import { ProjectType, TechStack, User } from "../../lib/data";
import { Database } from "../../lib/db";
import { AuthHandler } from "../../lib/auth/server";

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
					<Form className="flex flex-col p-6">
						<Field name="stack">
							{({ field }: FieldProps) => (
								<Listbox {...field} as="div">
									<Listbox.Label className="pr-2">Choose Stack</Listbox.Label>
									<Listbox.Button>{field.value && field.value.data.name}</Listbox.Button>
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

						Description:
						<ErrorMessage name="description">
							{msg => <div className="text-xs">{msg}</div>}
						</ErrorMessage>
						<Field name="description" type="text" className="text-primary p-1 pl-1.5 mb-4 bg-secondaryDark block w-full rounded outline-none border border-secondaryDark focus:border-secondaryPrimary transition duration-300 ease-out"/>

						Url:
						<ErrorMessage name="url">
							{msg => <div className="text-xs">{msg}</div>}
						</ErrorMessage>
						<Field name="url" type="text" className="text-primary p-1 pl-1.5 mb-4 bg-secondaryDark block w-full rounded outline-none border border-secondaryDark focus:border-secondaryPrimary transition duration-300 ease-out" />

						<button type="submit" className="bg-secondaryPrimary text-secondary flex mx-auto py-2 px-6 rounded-md mt-8 mb-4 text-lg hover:secondaryPrimaryDark transition duration-700 ease-out outline-none disabled:opacity-50" disabled={isSubmitting}>Submit</button>
					</Form>
				)}
			</Formik>
		</main>
	)
}

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