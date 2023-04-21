import { useState } from 'react'

export default function BlogForm({ handleNewBlog }) {
	const [blog, setBlog] = useState({ title: '', author: '', url: '' })
	function handleSubmit(ev) {
		ev.preventDefault()
		handleNewBlog(blog)
		setBlog({ title: '', author: '', url: '' })
	}
	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>
					title:{' '}
					<input
						type="text"
						value={blog.title}
						name="Title"
						onChange={(ev) => setBlog({ ...blog, title: ev.target.value })}
					/>
				</label>
			</div>
			<div>
				<label>
					author:{' '}
					<input
						type="text"
						value={blog.author}
						name="Author"
						onChange={(ev) => setBlog({ ...blog, author: ev.target.value })}
					/>
				</label>
			</div>
			<div>
				<label>
					url:{' '}
					<input
						type="text"
						value={blog.url}
						name="url"
						onChange={(ev) => setBlog({ ...blog, url: ev.target.value })}
					/>
				</label>
			</div>

			<button type="submit">submit</button>
		</form>
	)
}
