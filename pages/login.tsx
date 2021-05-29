import { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { loginWithEmail, loginWithGoogle, loginWithGithub } from "../lib/auth/client";
import { AuthHandler } from "../lib/auth/server";
import Link from 'next/link';
import { GetServerSidePropsContext } from "next";

import Head from 'next/head';
// boi sleep
// nou

type ValidationErrors = {
  email?: string,
  password?: string
};
type FormInput = {
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

	const onLoginWithGoogle = async () => {
		try {
			await loginWithGoogle();
			router.push("/profile");
		} catch(error){
			console.error(error);
		}
	};
	const onLoginWithGithub = async () => {
		try {
			await loginWithGithub();
			router.push("/profile");
		} catch(error){
			console.error(error);
		}
	};

  const onSubmit = async function (values: FormInput) {
    try {
      await loginWithEmail(values.email, values.password);
      router.push("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Kaow</title>
      </Head>
      <main className="bg-bg bg-gradient-to-b from-bg to-black text-lg text-white w-full h-screen flex justify-center items-center">
        <div className="bg-white p-8 text-gray sm:w-max flex flex-col gap-3 rounded w-full sm:h-auto h-screen">
					<h1 className="text-purple font-bold text-left pb-8 text-3xl sm:text-4xl">Login</h1>

					<div className="flex gap-2 sm:justify-between my-6 flex-wrap justify-center items-center sm:flex-row flex-col">
						<button className="text-sm w-max rounded outline-none border border-gray py-3 px-6" onClick={onLoginWithGoogle}>Login with Google</button>
						<button className="text-sm w-max rounded outline-none border border-gray py-3 px-6 sm:mt-0 mt-2" onClick={onLoginWithGithub}>Login with GitHub</button>
					</div>

          <Formik
            initialValues={{ email: '', password: '' } as any}
            validate={validateForm as any}
            onSubmit={onSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="py-2">
                <div className="flex justify-between py-2">
                  <h2 className="text-base font-medium -mb-2 p-2">Email:</h2>
                  <ErrorMessage name="email">
                    {msg => <div className="text-xs">{msg}</div>}
                  </ErrorMessage>
                  <Field name="email" type="email" className="p-1 pl-1.5 bg-snow block w-9/12 rounded outline-none border border-snow focus:border-lightPurple transition duration-300 ease-out" />
                </div>

                <div className="flex justify-between py-2">
                  <h2 className="text-base font-medium -mb-2 py-1">Password:</h2>
                  <ErrorMessage name="password">
                    {msg => <div className="text-xs">{msg}</div>}
                  </ErrorMessage>
                  <Field name="password" type="password" className="p-1 pl-1.5 bg-snow block w-9/12 rounded outline-none border border-snow focus:border-lightPurple transition duration-300 ease-out" />
                </div>

                <button className="bg-gradient-to-b from-lightPurple to-purple text-white py-2 px-6 rounded-md my-6 text-lg hover:from-purple hover:to-lightPurple transition duration-700 ease-out outline-none" type="submit" disabled={isSubmitting}>
									Login
								</button>
              </Form>
            )}
          </Formik>
          <p className="text-xs font-extralight md:text-sm">
            Don't have an account?

						<Link href="/signup">
              <a className="text-purple hover:text-red transition duration-300 pl-1 ease-in-out">
                Sign up
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

export default LoginPage;