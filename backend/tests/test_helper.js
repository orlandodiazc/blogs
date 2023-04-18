const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
	{
		title: 'Momentos',
		author: 'Andres Perez',
		url: 'stories.com',
		likes: 5,
	},
	{
		title: 'Live is Hard',
		author: 'Juan Diaz',
		url: 'stories.com',
		likes: 7,
	},
]

const nonExistingId = async () => {
	const blog = new Blog({
		url: 'website.com',
		title: 'house of cards',
		author: 'orlando',
	})
	await blog.save()
	await blog.deleteOne()

	return blog._id.toString()
}

const blogsInDb = async () => {
	const notes = await Blog.find({})
	return notes.map((note) => note.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map((u) => u.toJSON())
}

module.exports = {
	initialBlogs,
	nonExistingId,
	blogsInDb,
	usersInDb,
}
