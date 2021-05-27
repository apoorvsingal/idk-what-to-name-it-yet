import { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { loginWithEmail } from "../lib/auth/client";
import { AuthHandler } from "../lib/auth/server";
import Link from 'next/link';
import { GetServerSidePropsContext } from "next";

interface ValidationErrors {
	email?: string,
	password?: string
};
interface FormInput {
	email: string,
	password: string
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
	return errors;
};

const LoginPage = function () {
	const router = useRouter();

	const onSubmit = async function (values: FormInput) {
		try {
			await loginWithEmail(values.email, values.password);
			router.push("/profile");
		} catch (err) {
			console.error(err);
			// hanadle error
		}
	};

	return (
		<main className="bg-darkBlue text-lg text-white w-screen h-screen flex justify-center items-center">
			<div className="bg-white p-8 text-darkBlue w-full h-screen sm:max-w-xl flex flex-col gap-3 rounded">
				<h1 className="text-left p-2 sm:p-6 text-3xl sm:text-4xl">Login</h1>

				<Formik
					initialValues={{ email: '', password: '' } as any}
					validate={validateForm as any}
					onSubmit={onSubmit}
				>
					{({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
						<Form className="p-0 sm:p-12 sm:pb-4">
							<h2 className="text-sm font-medium -mb-2 py-2">Email:</h2>
							<ErrorMessage name="email">
								{msg => <div className="text-xs text-red">{msg}</div>}
							</ErrorMessage>
							<Field name="email" type="email" className="p-1 bg-lightGray w-full sm:w-4/5 rounded-sm border border-lightGray outline-none focus:border-orange transition duration-300 ease-out" />

							<h2 className="text-sm font-medium -mb-2 py-2">Password:</h2>
							<ErrorMessage name="password">
								{msg => <div className="text-xs text-red">{msg}</div>}
							</ErrorMessage>
							<Field name="password" type="password" className="p-1 bg-lightGray w-full sm:w-4/5 rounded-sm border border-lightGray outline-none focus:border-orange transition duration-300 ease-out" />

							<button className="bg-red text-white m-auto py-2 px-6 rounded-md my-4 text-lg hover:bg-lightRed transition duration-200 ease-out outline-none" type="submit" disabled={isSubmitting}>Login</button>
						</Form>
					)}
				</Formik>
				<p className="text-xs font-extralight text-center md:text-sm">Don't have an account? <Link href="/signup"><a className="font-semibold underline text-lightRed hover:text-red transition duration-300 ease-in-out">Sign up</a></Link></p>
			</div>
		</main>
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

export default LoginPage;