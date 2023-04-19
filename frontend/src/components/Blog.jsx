import { useState } from 'react'

export default function Blog({ blog, handleLike, handleRemove }) {
	const [visible, setVisible] = useState(false)

	return (
		<li>
			{blog.title} - {blog.author}
			<button type="button" onClick={() => setVisible(!visible)}>
				{visible ? 'close' : 'view'}
			</button>
			{visible && (
				<div>
					<p>{blog.url}</p>
					<p>
						likes: {blog.likes}{' '}
						<button type="button" onClick={() => handleLike(blog.id, blog)}>
							like
						</button>
					</p>
					<p>{blog.user.name}</p>
					<button type="button" onClick={() => handleRemove(blog.id)}>
						remove
					</button>
				</div>
			)}
		</li>
	)
}
