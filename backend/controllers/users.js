const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs')

	response.json(users)
})

usersRouter.post('/', async (request, response) => {
	const body = request.body
	const validatePassword = body.password && body.password.length > 3
	if (!validatePassword || !body.username)
		return response.status(400).end().json({
			error:
				'username and password are required, make sure the password has atleast 4 characters',
		})

	const { username, name, password } = body

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const user = new User({
		username,
		name,
		passwordHash,
	})

	const savedUser = await user.save()
	response.status(201).json(savedUser)
})

module.exports = usersRouter
