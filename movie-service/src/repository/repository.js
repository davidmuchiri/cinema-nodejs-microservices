"use strict"

// factory function that holds an open connection to the db
// and exposes some functions for accessing the data
const repository = db => {
	// since this is the movies-service, we already know that we are going to query the movies collection in all our functions

	const collection = db.collection("movies")

	const getAllMovies = () => {
		return new Promise((resolve, reject) => {
			const movies = []
			const cursor = collection.find({}, {title: 1, id: 1})
			const addMovie = movie => movie.push(movie)
			const sendMovies = error => {
				if (error) {
					reject({
						message: "An error occured fetching all movies",
						error,
					})
				} else {
					resolve(movies.slice())
				}
			}
			cursor.forEach(addMovie, sendMovies)
		})
	}

	// we use this function to get the latest movie premiers
	const getMoviePremiers = () => {
		return new Promise((resolve, reject) => {
			const movies = []
			const currentDay = new Date()
			const query = {
				releaseYear: {
					$gt: currentDay.getFullYear() - 1,
					$lte: currentDay.getFullYear(),
				},
				releaseMonth: {
					$gte: currentDay.getMonth() + 1,
					$lte: currentDay.getMonth() + 2,
				},
				releaseDay: {
					$lte: currentDay.getDate(),
				},
			}

			const cursor = collection.find(query)

			const addMovie = movie => movies.push(movie)
			const sendMovies = error => {
				if (error) {
					reject({
						message: "An error occured fetching all movies",
						error,
					})
				} else {
					resolve(movies)
				}
			}

			cursor.forEach(addMovie, sendMovies)
		})
	}

	const getMovieById = id => {
		return new Promise((resolve, reject) => {
			const projection = {_id: 0, id: 1, title: 1, format: 1}
			const sendMovie = (error, movie) => {
				if (error) {
					reject({
						message: `An error occured fetchingmovie with id: ${id}`,
						error,
					})
				} else {
					resolve(movie)
				}
			}
			collection.findOne({id: id}, projection, sendMovie)
		})
	}

	const disconnect = () => db.close()

	return {
		getAllMovies,
		getMoviePremiers,
		getMovieById,
		disconnect,
	}
}

const connect = connection => {
	return new Promise((resolve, reject) => {
		if (!connection) {
			reject(new Error("connection database not supplied!"))
		}
		resolve(repository(connection))
	})
}

module.exports = Object.assign({}, {connect})
