import { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { loginWithEmail, loginWithGoogle, loginWithGithub } from "../lib/auth/client";
import { AuthHandler } from "../lib/auth/server";
import Link from 'next/link';
import { GetServerSidePropsContext } from "next";
import Head from 'next/head';

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
      <main className="bg-primary text-lg text-secondary w-full h-screen flex justify-center items-center">
        <div className="bg-secondary p-8 text-primary sm:w-max flex flex-col gap-3 rounded w-full sm:h-auto h-screen">

					<h1 className="text-secondaryPrimaryLight font-bold text-center text-3xl sm:text-4xl">Login</h1>

					<div className="flex gap-2 sm:justify-between my-6 flex-wrap justify-center items-center sm:flex-row flex-col">

						<button className="text-sm w-max rounded outline-none border border-primary py-3 px-6 hover:text-secondaryPrimaryDark hover:border-secondaryPrimaryDark transition duration-300 ease-out" onClick={onLoginWithGoogle}>Login with Google</button>

						<button className="text-sm w-max rounded outline-none border border-primary py-3 px-6 sm:mt-0 mt-2 hover:text-secondaryPrimaryDark hover:border-secondaryPrimaryDark transition duration-300 ease-out" onClick={onLoginWithGithub}>Login with GitHub</button>

					</div>

          <Formik
            initialValues={{ email: '', password: '' } as any}
            validate={validateForm as any}
            onSubmit={onSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="py-2">
                  <h2 className="text-base font-medium">Email:</h2>
                  <ErrorMessage name="email">
                    {msg => <div className="text-xs text-secondaryPrimaryLight pb-1">{msg}</div>}
                  </ErrorMessage>
                  <Field name="email" type="email" className="p-1 pl-1.5 mb-4 bg-secondaryDark block w-full rounded outline-none border border-secondaryDark focus:border-secondaryPrimary transition duration-300 ease-out" />
         

                  <h2 className="text-base font-medium">Password:</h2>
                  <ErrorMessage name="password">
                    {msg => <div className="text-xs text-secondaryPrimaryLight pb-1">{msg}</div>}
                  </ErrorMessage>
                  <Field name="password" type="password" className="p-1 pl-1.5 bg-secondaryDark block w-full rounded outline-none border border-secondaryDark focus:border-secondaryPrimary transition duration-300 ease-out" />
                

                <button className="bg-secondaryPrimary text-secondary flex mx-auto py-2 px-6 rounded-md mt-8 mb-4 text-lg hover:bg-secondaryPrimaryDark transition duration-700 ease-out disabled:opacity-50 focus:outline-none" type="submit" disabled={isSubmitting}>
									Login
								</button>
              </Form>
            )}
          </Formik>
          <p className="text-xs text-center text-primary font-extralight md:text-sm">
            Don't have an account?

						<Link href="/signup">
              <a className="text-highlight hover:text-highlightDark transition duration-300 pl-1 ease-in-out text-secondaryPrimaryLight">
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