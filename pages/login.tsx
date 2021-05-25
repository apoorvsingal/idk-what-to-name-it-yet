import React, { useEffect } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";
import firebase from "../lib/firebase/client";

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

	useEffect(() => {
		console.log(firebase.auth().currentUser)
		if(firebase.auth().currentUser){
			router.push("/");
		}
	}, []);

	const onSubmit = async function(values: FormInput){
		await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
		await firebase.auth().signInWithEmailAndPassword(values.email, values.password);
		router.push("/");
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
						{errors.email && touched.email && errors.email}
						<input name="email" value={(values as unknown as FormInput).email} onChange={handleChange}></input>

						{errors.password && touched.password && errors.password}
						<input name="password" value={(values as unknown as FormInput).password} onChange={handleChange}></input>

						<button disabled={isSubmitting} onClick={handleSubmit as any}>Login</button>
					</div>
				)}
			</Formik>
		</>
	);
};


export default LoginPage;