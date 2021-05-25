module.exports = {
	async rewrites(){
		return [
			{
				source: "/api/users/:userId/projects/*",
				destination: "/api/projects/*"
			},
			{
				source: "/api/users/:userId/comemnts/",
				destination: "/api/comments/"
			},
			{
				source: "/api/projects/:projectId/comments",
				destination: "/api/comments"
			},
			{
				source: "/api/stacks/:stackId/projectTypes/*",
				destination: "/api/projectTypes/*"
			},
			{
				source: "/api/projectTypes/:projectTypeId/projects/*",
				destination: "/api/projects/*"
			},
		]
	}
};