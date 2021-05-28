module.exports = {
	images: {
		domains: ["media.discordapp.net", "lh3.googleusercontent.com"]
	},
	async rewrites(){
		return [
			{
				source: "/api/users/:userId/projects/:params*",
				destination: "/api/projects/:params*"
			},
			{
				source: "/api/users/:userId/comemnts/:params*",
				destination: "/api/comments/:params*"
			},
			{
				source: "/api/projects/:projectId/comments/:params*",
				destination: "/api/comments/:params*"
			},
			{
				source: "/api/stacks/:stackId/projectTypes/:params*",
				destination: "/api/projectTypes/:params*"
			},
			{
				source: "/api/projectTypes/:projectTypeId/projects/:params*",
				destination: "/api/projects/:params*"
			},
		]
	}
};