const {EventEmitter} = require("events")
const chalk = require("chalk")
const server = require("./server/Server")
const repository = require("./repository/repository")
const config = require("./config/mongo")
const ports = require("./environment/ports")
const logger = require("./config/logger")
const mediator = new EventEmitter()

//verbose logging when we start the server
logger.info(chalk.blue("*** Movies Service ***"))
logger.info(chalk.green("*** Connecting to movies repository ***"))

process.on("uncaughtException", error => logger.error(chalk.red("unhandled Execption", error)))

process.on("unhandledRejection", (error, promise) => {
	logger.error(chalk.red("unhandledRejection", error))
	logger.error(chalk.red("check this promise for unhandled rejections", promise))
})

mediator.on("db.ready", db => {
	let rep
	repository.connect(db).then(repo => {
		logger.info(chalk.green("*** Repository connected. starting server ***"))
		rep = repo
		return server
			.start({
				port: ports.env.httpPort,
				repo,
			})
			.then(app => {
				logger.info(
					chalk.green(
						`*** Server started successfully, running on port: ${ports.env.httpPort} ***`,
					),
				)
				app.on("close", () => rep.disconnect())
			})
	})
})

mediator.on("db.error", error => logger.error(chalk.red(error)))
config.connect(mediator)
mediator.emit("boot.ready")
