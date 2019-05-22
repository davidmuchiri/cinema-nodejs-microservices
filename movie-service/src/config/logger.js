"use strict"

/**
 * @author Muchiri Njugi
 * @description API logger the module will be used to log all errors or information from the api
 */

const {createLogger, format, transports} = require("winston")
const fs = require("fs")
const path = require("path")

const env = process.env.NODE_ENV || "development"
const logDir = path.resolve(__dirname, "../logs")

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

const verboseLog = path.join(logDir, "filelog-verbose.log")
const errorLog = path.join(logDir, "filelog-error.log")

const logger = createLogger({
	level: env === "development" ? "debug" : "info",
	format: format.combine(
		format.colorize(),
		format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
		format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
	),
	transports: [
		new transports.Console({
			level: "info",
			format: format.combine(
				format.label({label: path.basename(process.mainModule.filename)}),
				format.colorize(),
				format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
				format.printf(
					info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
				),
			),
		}),
		new transports.File({
			level: "verbose",
			filename: verboseLog,
			json: false,
		}),
		new transports.File({
			level: "error",
			filename: errorLog,
			json: false,
		}),
	],
})

module.exports = logger
