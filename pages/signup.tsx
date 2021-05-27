import React, { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { signupWithEmail } from "../lib/auth/client";
import { AuthHandler } from "../lib/auth/server";
import Link from 'next/link';

interface ValidationErrors {
	email?: string,
	username?: string,
	password?: string
	displayName?: string,
	bio?: string,
};
interface FormInput {
	email: string,
	username: string,
	password: string,
	password2: string
	displayName: string,
	bio?: string,
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
	} else if (values.password != values.password2) {
		errors.password = "Passwords do not match";
	}

	if (values.bio && values.bio.length > 128) {
		errors.bio = "Bio too long";
	}

	if (!values.displayName) {
		errors.displayName = "Required";
	} else if (values.displayName.length < 6) {
		errors.displayName = "Display name must be at least 6 characters long";
	} else if (values.password.length > 128) {
		errors.displayName = "Display name cannot be longer than 128 characters";
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
		await signupWithEmail(values.email, values.password, values.username, values.displayName, values.bio);
		router.push("/");
	};

	return (
		<main className="bg-darkBlue text-lg text-white w-screen h-screen flex justify-center items-center">
			<Formik
				initialValues={{ email: '', password: '', password2: '', displayName: '', bio: '', username: '' } as any}
				validate={validateForm as any}
				onSubmit={onSubmit}
			>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
					<Form className="bg-white p-8 text-darkBlue w-full max-w-xl flex flex-col gap-3 rounded">

						<h1 className="text-left p-6 text-4xl">Sign Up</h1>

						<div className="p-12 pb-4">
							<h2 className="text-sm font-medium -mb-2 py-2">Email:</h2>
							<ErrorMessage name="email" className="text-xs text-red" />
							<Field name="email" type="email" className="bg-lightGray w-4/5" />

							<h2 className="text-sm font-medium -mb-2 py-2">Username:</h2>
							<ErrorMessage name="username" className="text-xs text-red" />
							<Field name="username" type="text" className="bg-lightGray w-4/5" />

							<h2 className="text-sm font-medium -mb-2 py-2">Display Name:</h2>
							<ErrorMessage name="displayName" className="text-xs text-red" />
							<Field name="displayName" type="text" className="bg-lightGray w-4/5" />

							<h2 className="text-sm font-medium -mb-2 py-2">Bio:</h2>
							<ErrorMessage name="bio" className="text-xs text-red" />
							<Field name="bio" type="text" className="bg-lightGray w-4/5" />

							<h2 className="text-sm font-medium -mb-2 py-2">Password:</h2>
							<ErrorMessage name="password" className="text-xs text-red" />
							<Field name="password" type="password" className="bg-lightGray block w-4/5 mb-2" />
							<Field name="password2" type="password" className="bg-lightGray block w-4/5" />
						</div>

						<button className="bg-red text-white m-auto py-2 px-6 rounded-md my-4 text-lg hover:bg-lightRed transition duration-200 ease-out" type="submit" disabled={isSubmitting}>Sign Up</button>

						<p className="text-xs font-extralight text-center md:text-sm">Already have an account? <Link href="/login"><a className="font-semibold underline text-lightRed hover:text-red transition duration-300 ease-in-out">Sign in</a></Link></p>
					</Form>
				)}
			</Formik>
		</main>
	);
};

export const getServerSideProps = async function ({ req }) {
	const authHandler = new AuthHandler;
	const sessionCookie: string = req.cookies.session;

	if (!sessionCookie) {
		return {};
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