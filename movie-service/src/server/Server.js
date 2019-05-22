const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
const movieAPI = require("../api/movies")

const start = options => {
	return new Promise((resolve, reject) => {
		if (!options.repo) {
			reject(new Error("The server must be started with a connected repository"))
		}
		if (!options.port) {
			reject(new Error("The server must be started with an available port"))
		}

		const app = express()
		app.use(morgan("dev"))
		app.use(helmet())
		// eslint-disable-next-line no-unused-vars
		app.use((error, req, res, next) => {
			reject(new Error("Something went wrong !, error:" + error))
			res.status(500).send("Something went wrong!")
		})

		movieAPI(app, options)
		const server = app.listen(options.port, () => resolve(server))
	})
}

module.exports = Object.assign({}, {start})
