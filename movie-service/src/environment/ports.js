// Container for all environment
const environments = {}

//Development environment

environments.development = {
	httpPort: 5000,
	httpsPort: 5001,
	envName: "development",
}

environments.production = {
	httpPort: 9000,
	httpsPort: 9001,
	envName: "production",
}
const currentEnvironment =
	typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV.toLowerCase() : ""
const env =
	typeof environments[currentEnvironment] === "object"
		? environments[currentEnvironment]
		: environments.development

module.exports = Object.assign({}, {env})
