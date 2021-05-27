import { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { signupWithEmail } from "../lib/auth/client";
import { AuthHandler } from "../lib/auth/server";
import Link from 'next/link';
import { Transition } from "@headlessui/react";
import { GetServerSidePropsContext } from "next";
import Head from 'next/head';

type ValidationErrors = {
	email?: string,
	username?: string,
	password?: string
};
type FormInput = {
	email: string,
	username: string,
	password: string,
};

const validateForm = (values: FormInput): ValidationErrors => {
	const errors: ValidationErrors = {};

	if (!values.email) {
		errors.email = "Required";
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
		errors.email = "Invalid email address";
	}

	if (!values.password) {
		errors.password = "Required";
	} else if (values.password.length < 6) {
		errors.password = "Password must be at least 6 characters long";
	} else if (values.password.length > 128) {
		errors.password = "Password cannot be longer than 128 characters";
	}
	
	if (!values.username) {
		errors.username = "Required";
	} else if (values.username.length < 3) {
		errors.username = "Username must be at least 6 characters long";
	} else if (values.password.length > 24) {
		errors.username = "Username cannot be longer than 128 characters";
	}
	return errors;
};

const SignupPage = function () {
	const router = useRouter();

	const onSubmit = async function (values: FormInput) {
		await signupWithEmail(values.email, values.password, values.username);
		router.push("/profile", );
	};

	return (
		<>
			<Head>
				<title>Sign up - Kaow</title>
			</Head>
			<main className="bg-darkBlue text-lg text-white w-screen h-screen flex justify-center items-center">
				<h1 className="text-left text-3xl sm:text-4xl mb-2">Sign Up</h1>

				<div className="bg-white p-6 sm:p-10 text-darkBlue w-screen sm:max-w-lg flex flex-col gap-3 rounded">
					<Formik
						initialValues={{ email: '', password: '', password2: '', displayName: '', bio: '', username: '' } as any}
						validate={validateForm as any}
						onSubmit={onSubmit}
					>
						{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
							<Form className="py-2">

								<h2 className="text-sm font-medium py-1">Email:</h2>
								<ErrorMessage name="email">
									{msg => <div className="text-xs text-red">{msg}</div>}
								</ErrorMessage>
								<Field name="email" type="email" className="p-1 bg-lightGray w-full rounded-sm border border-lightGray outline-none focus:border-lightRed transition duration-300 ease-out" />

								<h2 className="text-sm font-medium py-1">Username:</h2>
								<ErrorMessage name="username">
									{msg => <div className="text-xs text-red">{msg}</div>}
								</ErrorMessage>
								<Field name="username" type="text" className="p-1 bg-lightGray w-full rounded-sm border border-lightGray outline-none focus:border-lightRed transition duration-300 ease-out" />

								<h2 className="text-sm font-medium py-1">Password:</h2>
								<ErrorMessage name="password">
									{msg => <div className="text-xs text-red">{msg}</div>}
								</ErrorMessage>
								<Field name="password" type="password" className="p-1 bg-lightGray block w-full rounded-sm border border-lightGray outline-none focus:border-lightRed transition duration-300 ease-out" />

								<button className="bg-red text-white w-max py-2 px-6 rounded-md my-4 text-lg hover:bg-lightRed transition duration-200 ease-out outline-none" type="submit" disabled={isSubmitting}>Sign Up</button>

							</Form>
						)}
					</Formik>

					<p className="text-xs font-extralight md:text-sm">
						Already have an account?

						<Link href="/login">
							<a className="font-semibold underline text-lightRed hover:text-red transition duration-300 ease-in-out">
								Sign in
							</a>
						</Link>
					</p>
				</div>
			</main>
		</>
	);
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
	const authHandler = new AuthHandler;
	const sessionCookie: string = req.cookies.session;

	if (!sessionCookie) {
		return { props: {} };
	}
	try {
		await authHandler.init();
		await authHandler.verifySessionCookie(sessionCookie);

		return { redirect: { destination: "/profile", permamnent: false } };
	} catch (error) {
		console.error(error);
		return { props: { error: error.message } };
	}
};

export default SignupPage;