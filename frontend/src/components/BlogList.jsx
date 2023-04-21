import Blog from './Blog'

export default function BlogList({ user, blogs, handleLike, handleRemove }) {
	return (
		<ul>
			{blogs.map((blog) => (
				<Blog
					key={blog.id}
					blog={blog}
					handleLike={handleLike}
					handleRemove={handleRemove}
					user={user}
				/>
			))}
		</ul>
	)
}
