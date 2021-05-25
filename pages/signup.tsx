import React, { useEffect } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";
import firebase from "../lib/firebase/client";
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
		<>
			<Formik
				initialValues={{ email: '', password: '', password2: '', displayName: '', bio: '', username: '' } as any}
				validate={validateForm as any}
				onSubmit={onSubmit}
			>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
					<div>
						Email:
						{errors.email && touched.email && errors.email}
						<input name="email" value={(values as unknown as FormInput).email} onChange={handleChange}></input>
						<br/>
						
						Username:
						{errors.username && touched.username && errors.username}
						<input name="username" value={(values as unknown as FormInput).username} onChange={handleChange}></input>
						<br/>

						Display Name:
						{errors.displayName && touched.displayName && errors.displayName}
						<input name="displayName" value={(values as unknown as FormInput).displayName} onChange={handleChange}></input>
						<br/>

						Bio:
						{errors.bio && touched.bio && errors.bio}
						<input name="bio" value={(values as unknown as FormInput).bio} onChange={handleChange}></input>
						<br/>

						Password:
						{errors.password && (touched.password || touched.password2) && errors.password}
						<input name="password" type="password" value={(values as unknown as FormInput).password} onChange={handleChange}></input>
						<input name="password2" type="password" value={(values as unknown as FormInput).password2} onChange={handleChange}></input>
						<br/>

						<button type="submit" disabled={isSubmitting} onClick={handleSubmit as any}>Sign Up</button>
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

export default SignupPage;