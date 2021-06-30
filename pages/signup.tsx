import { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Router, useRouter } from "next/router";
import { loginWithGithub, loginWithGoogle, signupWithEmail, signupWithIdToken } from "../lib/auth/client";
import { AuthHandler } from "../lib/auth/server";
import Link from 'next/link';
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

const EmailSignUpForm = () => {
	const router = useRouter();

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
		}

		if (values.password.length > 24) {
			errors.username = "Username cannot be longer than 128 characters";
		}
		return errors;
	};

	const onSubmit = async function (values: FormInput) {
		await signupWithEmail(values.email, values.password, values.username);
		router.push("/profile");
	};

	return (
		<Formik
			initialValues={{ email: '', password: '', password2: '', displayName: '', bio: '', username: '' } as any}
			validate={validateForm as any}
			onSubmit={onSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
				<Form>

					<h2 className="text-base font-medium">Email:</h2>
					<ErrorMessage name="email">
						{msg => <div className="text-xs text-secondaryPrimaryLight pb-1">{msg}</div>}
					</ErrorMessage>
					<Field name="email" type="email" className="p-1 pl-1.5 mb-4 bg-secondaryDark block w-full rounded outline-none border border-secondaryDark focus:border-secondaryPrimary transition duration-300 ease-out" />

					<h2 className="text-base font-medium">Username:</h2>
					<ErrorMessage name="username">
						{msg => <div className="text-xs text-secondaryPrimaryLight pb-1">{msg}</div>}
					</ErrorMessage>

					<Field name="username" type="text" className="p-1 pl-1.5 mb-4 bg-secondaryDark block w-full rounded outline-none border border-secondaryDark focus:border-secondaryPrimary transition duration-300 ease-out" />

					<h2 className="text-base font-medium">Password:</h2>
					<ErrorMessage name="password">
						{msg => <div className="text-xs text-secondaryPrimaryLight pb-1">{msg}</div>}
					</ErrorMessage>
					<Field name="password" type="password" className="p-1 pl-1.5 bg-secondaryDark block w-full rounded outline-none border border-secondaryDark focus:border-secondaryPrimary transition duration-300 ease-out" />

					<button className="bg-secondaryPrimary text-secondary flex mx-auto py-2 px-6 rounded-md mt-8 mb-4 text-lg hover:bg-secondaryPrimaryDark transition duration-700 ease-out disabled:opacity-50 focus:outline-none" type="submit" disabled={isSubmitting}>
						Sign Up
          </button>
				</Form>
			)}
		</Formik>
	)
};

const SignInProviders = () => {
	const router = useRouter();

	const onLoginWithGoogle = async () => {
		try {
			await loginWithGoogle();
			router.push("/profile");
		} catch (error) {
			console.error(error);
		}
	};

	const onLoginWithGithub = async () => {
		try {
			await loginWithGithub();
			router.push("/profile");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex gap-2 sm:justify-between my-6 flex-wrap justify-center items-center sm:flex-row flex-col">
			<button className="text-sm w-max rounded outline-none border border-primary py-3 px-6 hover:text-secondaryPrimaryDark hover:border-secondaryPrimaryDark transition duration-300 ease-out" onClick={onLoginWithGoogle}>Sign Up with Google</button>
			<button className="text-sm w-max rounded outline-none border border-primary py-3 px-6 sm:mt-0 mt-2 hover:text-secondaryPrimaryDark hover:border-secondaryPrimaryDark transition duration-300 ease-out" onClick={onLoginWithGithub}>Sign Up with GitHub</button>
		</div>
	);
};

const NewSignUp = () => {
	return (
		<>
			<SignInProviders />
			<EmailSignUpForm />

			<p className="text-xs text-primary text-center font-extralight md:text-sm">
				Already have an account?
        <Link href="/login">
					<a className="text-secondaryPrimaryLight hover:text-highlightDark transition duration-300 pl-1 ease-in-out">
						Sign in
          </a>
				</Link>
			</p>
		</>
	)
};

const SignUpAfterProvider = () => {
	const router = useRouter();

	const validateForm = (values: { username: string }): { username?: string } => {
		const errors: { username?: string } = {};

		if (!values.username) {
			errors.username = "Required";
		} else if (values.username.length < 3) {
			errors.username = "Username must be at least 6 characters long";
		}
		return errors;
	};

	const onSubmit = async function (values: { username: string }) {
		await signupWithIdToken(values.username);
		router.push("/profile");
	};

	return (
		<Formik
			initialValues={{ email: '', password: '', password2: '', displayName: '', bio: '', username: '' } as any}
			validate={validateForm as any}
			onSubmit={onSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
				<Form>

					<h2 className="text-base font-medium py-1">Username:</h2>
					<ErrorMessage name="username">
						{msg => <div className="text-xs">{msg}</div>}
					</ErrorMessage>
					<Field name="username" type="text" className="p-1 pl-1.5 bg-secondaryDark block w-9/12 rounded outline-none border border-secondaryDark focus:border-secondaryPrimary transition duration-300 ease-out" />

					<button className="bg-secondaryPrimaryLight text-secondary  py-2 px-6 rounded-md my-6 text-lg hover:secondaryPrimary transition duration-700 ease-out outline-none" type="submit" disabled={isSubmitting}>
						Sign Up
          </button>

				</Form>
			)}
		</Formik>
	);
};

const SignupPage = function () {
	const router = useRouter();

	return (
		<main className="bg-primary text-lg text-secondary w-full h-full min-h-screen flex justify-center items-center">
			<Head>
				<title>Sign up - Kaow</title>
			</Head>

			<div className="bg-secondary p-8 text-primary sm:w-max flex flex-col gap-3 rounded w-full sm:h-auto h-screen">
				<h1 className="text-secondaryPrimaryLight font-bold text-center text-3xl sm:text-4xl">Sign Up</h1>
				{router.query.next ? <SignUpAfterProvider /> : <NewSignUp />}
			</div>
		</main>
	);
};

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
	const authHandler = new AuthHandler;
	const sessionCookie: string = req.cookies.session;
	const next = query.next ?.toString();

	if (!sessionCookie || next) {
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