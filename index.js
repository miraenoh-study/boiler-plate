const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('./config/key')
const { User } = require('./models/User')

// Configure bodyParser and cookieParser
app.use(bodyParser.urlencoded({ extended: true })) // application/x-www-form-urlencoded
app.use(bodyParser.json()) // application/json
app.use(cookieParser())

// Connect to mongodb
mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('MongoDB Connected')
	})
	.catch((err) => {
		console.log(err)
	})

app.get('/', (req, res) => {
	res.send('Hello World!')
})

// Registration endpoint
app.post('/register', (req, res) => {
	// Get info for registration from the client
	const user = new User(req.body)

	// Save info into mongodb
	user.save((err, user) => {
		if (err) {
			return res.json({ success: false, err })
		}
		return res.status(200).json({
			success: true
		})
	})
})

// Login endpoint
app.post('/login', (req, res) => {
	// Find the email from mongodb
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user) {
			return res.json({
				success: false,
				message: "There's no user corresponding to the e-mail."
			})
		}

		// Check if the password matches
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch) {
				return res.json({
					success: false,
					message: 'Wrong password.'
				})
			}

			// All values are valid
			// Create a tocken for the user
			user.generateToken((err, user) => {
				if (err) return res.status(400).send(err)

				// Login success
				// Save the token into cookies and send the response
				res.cookie('x_auth', user.token).status(200).json({
					success: true,
					userId: user._id
				})
			})
		})
	})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
