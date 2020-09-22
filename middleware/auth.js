const { User } = require('../models/User')

let auth = (req, res, next) => {
	// Process authentication
	// Get a token from the client cookies
	let token = req.cookies.x_auth

	// Decode the token and find the user
	User.findByToken(token, (err, user) => {
		if (err) throw err

		if (!user)
			return res.json({
				isAuth: false,
				error: true
			})

		// User exists, Auth success
		req.token = token
		req.user = user
		next()
	})
}

module.exports = { auth }
