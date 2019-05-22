/* eslint-env mocha */

const server = require("./Server")
const expect = require("expect")

describe("Server", () => {
	it("should require a port to start", () => {
		return server
			.start({
				repo: {},
			})
			.catch(error => {
				expect(error).toBeInstanceOf(Error)
				expect(error.message).toBe("The server must be started with an available port")
			})
	})

	it("should require a repository to start", () => {
		return server
			.start({
				port: "",
			})
			.catch(error => {
				expect(error).toBeInstanceOf(Error)
				expect(error.message).toBe("The server must be started with a connected repository")
			})
	})
})
