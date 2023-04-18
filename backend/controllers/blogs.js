const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user')
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const body = request.body
	const token = request.token
	if (!token.id) {
		return response.status(401).json({ error: 'token invalid' })
	}
	const user = await User.findById(token.id)

	const blog = new Blog({
		...body,
		user: user.id,
	})

	if (!blog.url || !blog.title) return response.status(400).end()

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	response.json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
	const token = request.token
	if (!token.id) {
		return response.status(401).json({ error: 'token invalid' })
	}
	const blog = await Blog.findById(request.params.id)

	if (blog.user.toString() !== token.id.toString()) {
		return response.status(401).json({ error: 'wrong user for blog' })
	}

	await blog.remove()

	const user = await User.findById(token.id).populate('blogs')
	user.blogs = user.blogs.map((b) => b.id)
	await user.save()

	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
	const result = await Blog.findByIdAndUpdate(request.params.id, request.body, {
		new: true,
	})
	response.json(result)
})

module.exports = blogsRouter
