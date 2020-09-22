const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const constants = require('../constants')

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50
	},
	email: {
		type: String,
		trim: true,
		unique: 1
	},
	password: {
		type: String,
		minlength: 5
	},
	lastname: {
		type: String,
		maxlength: 50
	},
	role: {
		type: Number,
		default: 0
	},
	image: String,
	token: String,
	tokenExp: Number
})

// Preprocessor for save action
userSchema.pre('save', function (next) {
	let user = this

	// Encrypt the password if the password is modified
	if (user.isModified('password')) {
		// Generate the salt
		const saltRounds = 10 // # characters of the salt
		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) return next(err)

			// Encrypt the password with the salt
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return next(err)

				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

// Compare a given password with the password from mongodb
userSchema.methods.comparePassword = function (plainPassword, cb) {
	// compare the password with the encrypted password
	// cb: Call Back
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return cb(err)

		cb(null, isMatch)
	})
}

// Generate a token for the user
userSchema.methods.generateToken = function (cb) {
	// cb: Call Back
	let user = this

	// Generate a token with jsonwebtoken
	let token = jwt.sign(user._id.toHexString(), constants.TOKEN_KEY)
	user.token = token
	user.save(function (err, user) {
		if (err) return cb(err)

		cb(null, user)
	})
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
