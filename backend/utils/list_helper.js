function totalLikes(blogs) {
	if (blogs.lenght === 0) return 0
	if (blogs.length === 1) return blogs[0].likes

	return blogs.reduce((t, { likes }) => likes + t, 0)
}

function favoriteBlogs(blogs) {
	if (blogs.lenght === 0) return null
	if (blogs.length === 1) return blogs[0]
	return blogs.reduce((prev, current) =>
		prev.likes > current.likes ? prev : current
	)
}

function mostBlogs(blogs) {
	if (blogs.lenght === 0) return null
	if (blogs.length === 1) return { author: blogs[0].author, blogs: 1 }

	const result = blogs.reduce((acc, curr) => {
		acc[curr.author] = acc[curr.author] ? acc[curr.author] + 1 : 1
		return acc
	}, {})

	return Object.keys(result).reduce((a, b) =>
		result[a] > result[b]
			? { author: a, blogs: result[a] }
			: { author: b, blogs: result[b] }
	)
}

module.exports = {
	totalLikes,
	favoriteBlogs,
	mostBlogs,
}
