const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const config = require('./config/dev')
const { User } = require('./models/User')

// Configure bodyParser
app.use(bodyParser.urlencoded({ extended: true })) // application/x-www-form-urlencoded
app.use(bodyParser.json()) // application/json

// Connect to mongodb
mongoose
	.connect(config.mongodbConnextionString, {
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

// Registration
app.post('/register', (req, res) => {
	// Get info for registration from the client
	const user = new User(req.body)

	// Save info into mongodb
	user.save((err, userInfo) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).json({
			success: true
		})
	})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
