import React, { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { signupWithEmail } from "../lib/auth/client";
import { AuthHandler } from "../lib/auth/server";

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
	} else if(values.password != values.password2){
		errors.password = "Passwords do not match";
	}

	if(values.bio && values.bio.length > 128){
		errors.bio = "Bio too long";
	}
	
	if(!values.displayName){
		errors.displayName = "Required";
	} else if(values.displayName.length < 6){
		errors.displayName = "Display name must be at least 6 characters long";
	} else if(values.password.length > 128){
		errors.displayName = "Display name cannot be longer than 128 characters";
	}
	
	if(!values.username){
		errors.username = "Required";
	} else if(values.username.length < 3){
		errors.username = "Username must be at least 6 characters long";
	} else if(values.password.length > 24){
		errors.username = "Username cannot be longer than 128 characters";
	}
	return errors;
};

const SignupPage = function(){
	const router = useRouter();

	const onSubmit = async function(values: FormInput){
		await signupWithEmail(values.email, values.password, values.username, values.displayName, values.bio);
		router.push("/");
	};
	
	return (
		<Formik
			initialValues={{ email: '', password: '', password2: '', displayName: '', bio: '', username: '' } as any}
			validate={validateForm as any}
			onSubmit={onSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
				<Form>
					Email:
					<ErrorMessage name="email"/>
					<Field name="email" type="email"/>
					<br/>
					
					Username:
					<ErrorMessage name="username"/>
					<Field name="username" type="text"/>
					<br/>

					Display Name:
					<ErrorMessage name="displayName"/>
					<Field name="displayName" type="text"/>
					<br/>

					Bio:
					<ErrorMessage name="bio"/>
					<Field name="bio" type="text"/>
					<br/>

					Password:
					<ErrorMessage name="password"/>
					<Field name="password" type="password"/>
					<Field name="password2" type="password"/>
					<br/>

					<button type="submit" disabled={isSubmitting}>Sign Up</button>
				</Form>
			)}
		</Formik>
	);
};

export const getServerSideProps = async function({ req }){
	const authHandler = new AuthHandler;
	const sessionCookie: string = req.cookies.session;
	
	if(!sessionCookie){
		return {};
	}
	try {
		await authHandler.init();
		await authHandler.verifySessionCookie(sessionCookie);
		
		return { redirect: { destination: "/profile", permamnent: false } };
	} catch(error){
		console.error(error);
		return { props: { error: error.message }};
	}
};

export default SignupPage;