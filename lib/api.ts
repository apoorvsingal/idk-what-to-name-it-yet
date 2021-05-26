import fetch from "isomorphic-unfetch";

const postReq = (endpoint: string, body: object) => {
	return fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	}).then(res => res.json());
};

export const login = (data: object) => {
	return postReq("/api/login", data);
};
export const signup = (data: object) => {
	return postReq("/api/signup", data);
};