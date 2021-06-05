// import fetch from "isomorphic-unfetch";

const postReq = (endpoint: string, body: object) => {
	return fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	}).then(res => res.json());
};

const getReq = (endpoint: string, query: object = {}) => {
	return fetch(endpoint + "?" + Object.entries(query).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&"))
		.then(res => res.json());
};

export const login = (data: object) => {
	return postReq("/api/login", data);
};
export const signup = (data: object) => {
	return postReq("/api/signup", data);
};

export const getStacks = (options: object = {}) => {
	return getReq("/api/stacks", options);
};