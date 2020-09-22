const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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

const User = mongoose.model('User', userSchema)

module.exports = { User }
