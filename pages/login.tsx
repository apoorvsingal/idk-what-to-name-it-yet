import React, { useEffect } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";
import firebase from "../lib/firebase/client";
import { loginWithEmail } from "../lib/auth/client";
import { AuthHandler } from "../lib/auth/server";

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

	if(!values.email){
		errors.email = "Required";
	} else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)){
		errors.email = "Invalid email address";
	}
	if(!values.password){
		errors.password = "Required";
	} else if(values.password.length < 6){
		errors.password = "Password must be at least 6 characters long";
	} else if(values.password.length > 128){
		errors.password = "Password cannot be longer than 128 characters";
	}
	return errors;
};

const LoginPage = function(){
	const router = useRouter();

	const onSubmit = async function(values: FormInput){
		try {
			await loginWithEmail(values.email, values.password);
			router.push("/profile");
		} catch(err){
			console.error(err);
			// hanadle error
		}
	};

	return (
		<>
			<Formik
				initialValues={{ email: '', password: '' } as any}
				validate={validateForm as any}
				onSubmit={onSubmit}
			>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
					<div>
						Email:
						{errors.email && touched.email && errors.email}
						<input name="email" value={(values as unknown as FormInput).email} onChange={handleChange}></input>
						<br/>

						Password:
						{errors.password && touched.password && errors.password}
						<input name="password" type="password" value={(values as unknown as FormInput).password} onChange={handleChange}></input>
						<br/>

						<button type="submit" disabled={isSubmitting} onClick={handleSubmit as any}>Login</button>
					</div>
				)}
			</Formik>
		</>
	);
};

const auth = new AuthHandler;

export const getServerSideProps = async function({ req }){
	const sessionCookie: string = req.cookies.session;
	
	if(!sessionCookie){
		return {};
	}
	try {
		await auth.init();
		const { uid } = await auth.verifySessionCookie(sessionCookie);
		
		return { 	
			redirect: {
				destination: "/profile",
				permamnent: false
			}
		};
	} catch(error){
		return { props: { error: error.message }};
	}
};

export default LoginPage;