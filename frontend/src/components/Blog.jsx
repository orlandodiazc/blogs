import { useState } from 'react'

export default function Blog({ user, blog, handleLike, handleRemove }) {
	const [visible, setVisible] = useState(false)
	return (
		<li>
			<span>{blog.title}</span> - <span>{blog.author}</span>
			<button type="button" onClick={() => setVisible(!visible)}>
				{visible ? 'close' : 'view'}
			</button>
			{visible && (
				<div>
					<p>{blog.url}</p>
					<p>
						likes: <span>{blog.likes}</span>
						<button type="button" onClick={() => handleLike(blog.id, blog)}>
							like
						</button>
					</p>
					<p>{blog.user.name}</p>
					{user.username === blog.user.username && (
						<button type="button" onClick={() => handleRemove(blog.id)}>
							remove
						</button>
					)}
				</div>
			)}
		</li>
	)
}
