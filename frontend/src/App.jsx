import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Toggable from './components/Toggable'
import LoggedIn from './components/LoggedIn'
import BlogList from './components/BlogList'

function App() {
	const [blogs, setBlogs] = useState([])
	const [message, setMessage] = useState(null)
	const [user, setUser] = useState(null)
	const blogFormRef = useRef()

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs))
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('blogsUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	async function handleLogin(username, password) {
		try {
			const user = await loginService.login({
				username,
				password,
			})

			window.localStorage.setItem('blogsUser', JSON.stringify(user))
			setUser(user)
			setMessage({ description: 'Logged in', error: false })
			blogService.setToken(user.token)
		} catch (exception) {
			setMessage({ description: 'Wrong credentials', error: true })
		}
		setTimeout(() => {
			setMessage(null)
		}, 5000)
	}

	async function handleNewBlog(newBlog) {
		try {
			const createdBlog = await blogService.addBlog(newBlog)
			console.log(createdBlog)
			blogFormRef.current.toggleVisibility()
			setBlogs([...blogs, createdBlog])
			setMessage({ description: 'Added new blog', error: false })
		} catch (exception) {
			setMessage({ description: 'Unable to add blog', error: true })
		}
		setTimeout(() => {
			setMessage(null)
		}, 5000)
	}

	async function handleLike(id, blog) {
		try {
			const newBlogsState = blogs.map((blog) => {
				if (blog.id === id) return { ...blog, likes: blog.likes + 1 }
				return blog
			})
			setBlogs(newBlogsState)
			const blogToUpdate = {
				user: blog.user.id,
				likes: blog.likes + 1,
				author: blog.author,
				title: blog.title,
				url: blog.url,
			}
			await blogService.updateLike(id, blogToUpdate)
			setMessage({ description: 'Updated blog', error: false })
		} catch (exception) {
			setMessage({ description: 'Unable to update blog', error: true })
		}
		setTimeout(() => {
			setMessage(null)
		}, 5000)
	}

	async function handleRemove(id) {
		try {
			const newBlogsState = blogs.filter((blog) => blog.id !== id)
			await blogService.removeBlog(id)
			setBlogs(newBlogsState)
			setMessage({ description: 'Deleted blog', error: false })
		} catch (exception) {
			setMessage({ description: 'Unable to delete blog', error: true })
		}
		setTimeout(() => {
			setMessage(null)
		}, 5000)
	}

	const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

	return (
		<div>
			<h1>Blogs</h1>
			<Notification message={message} />
			{!user ? (
				<Toggable buttonLabel="log in">
					<LoginForm handleLogin={handleLogin} />
				</Toggable>
			) : (
				<>
					<LoggedIn name={user.name} />
					<h2>Add blog</h2>
					<Toggable buttonLabel="Add new blog" ref={blogFormRef}>
						<BlogForm handleNewBlog={handleNewBlog} />
					</Toggable>
					<BlogList
						blogs={sortedBlogs}
						handleLike={handleLike}
						handleRemove={handleRemove}
					/>
				</>
			)}
		</div>
	)
}

export default App
