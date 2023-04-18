const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
	await User.deleteMany({})

	const passwordHash = await bcrypt.hash('sekret', 10)
	const user = new User({ username: 'root', passwordHash })

	await user.save()
})

describe('when there is initially some blogs saved', () => {
	beforeEach(async () => {
		await Blog.deleteMany({})
		await Blog.insertMany(helper.initialBlogs)
	})

	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs')
		expect(response.body).toHaveLength(helper.initialBlogs.length)
	})

	test('a specific blog is within the returned blogs', async () => {
		const response = await api.get('/api/blogs')
		const titles = response.body.map((r) => r.title)
		expect(titles).toContain('Live is Hard')
	})

	test('returned blogs have the id key', async () => {
		const response = await api.get('/api/blogs')
		response.body.forEach((blog) => {
			expect(blog).toHaveProperty('id')
			expect(blog.id).toBeDefined()
		})
	})

	describe('when adding a new blog', () => {
		test('a valid blog can be added', async () => {
			const newBlog = {
				title: 'casita',
				author: 'orlando',
				url: 'casita.com',
				likes: 3,
			}

			await api
				.post('/api/blogs')
				.send(newBlog)
				.expect(201)
				.expect('Content-Type', /application\/json/)

			const response = await api.get('/api/blogs')

			const contents = response.body.map((r) => r.title)

			expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
			expect(contents).toContain('casita')
		})

		test('likes default to 0 when not included in post', async () => {
			const newBlog = {
				title: 'casita',
				author: 'orlando',
				url: 'casita.com',
			}

			const result = await api.post('/api/blogs').send(newBlog)
			expect(result.body).toHaveProperty('likes', 0)
		})

		test('title and url props must be in the post request', async () => {
			const newBlogs = [
				{
					title: 'casita',
					author: 'orlando',
					likes: 7,
				},
				{
					url: 'website.com',
					author: 'orlando',
					likes: 3,
				},
			]

			await api.post('/api/blogs').send(newBlogs[0]).expect(400)
			await api.post('/api/blogs').send(newBlogs[1]).expect(400)
		})
	})

	describe('deletion of a blog', () => {
		test('succeeds with 204 if id valid', async () => {
			const blogsAtStart = await helper.blogsInDb()
			const blogToDelete = blogsAtStart[0]

			await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

			const blogsAtEnd = await helper.blogsInDb()

			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

			const titles = blogsAtEnd.map((r) => r.title)

			expect(titles).not.toContain(blogToDelete.title)
		})
	})

	describe('update likes', () => {
		test('likes amount changed correctly', async () => {
			const blogsAtStart = await helper.blogsInDb()
			const blogToUpdate = blogsAtStart[0]
			blogToUpdate.likes = 80
			await api
				.put(`/api/blogs/${blogToUpdate.id}`)
				.send(blogToUpdate)
				.expect(200)

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
			const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)

			expect(updatedBlog).toHaveProperty('likes', blogToUpdate.likes)
		})
	})
})

describe('when there is initially one user in db', () => {
	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen',
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

		const usernames = usersAtEnd.map((u) => u.username)
		expect(usernames).toContain(newUser.username)
	})

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen',
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain('expected `username` to be unique')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toEqual(usersAtStart)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
