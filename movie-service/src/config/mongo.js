const path = require("path")
const MongoClient = require("mongodb").MongoClient

require("dotenv").config({path: path.resolve(__dirname, "../environment/.env")})

const MongoURL = process.env.MONGO_URL
const dbName = ""

const connect = mediator => {
	const client = new MongoClient(MongoURL, {useNewUrlParser: true})
	mediator.once("boot.ready", async () => {
		try {
			await client.connect()
			const db = client.db(dbName)
			mediator.emit("db.ready", db)
		} catch (error) {
			mediator.emit("db.error", error)
		}
	})
}

module.exports = Object.assign({}, {connect})
