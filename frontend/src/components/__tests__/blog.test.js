import { render, screen } from '@testing-library/react'
import Blog from '../Blog'
import userEvent from '@testing-library/user-event'

const blog = {
	title: 'new york',
	author: 'usuario',
	url: 'website.com',
	likes: '0',
	user: { name: 'root' },
}

test('blog initially only renders title and author', () => {
	render(<Blog blog={blog} />)
	expect(screen.getByText(blog.title)).toBeDefined()
	expect(screen.getByText(blog.author)).toBeDefined()
})

test('url and likes shown when the view more button is clicked', async () => {
	render(<Blog blog={blog} />)
	await userEvent.click(screen.getByText('view'))
	expect(screen.getByText(blog.likes)).toBeDefined()
	expect(screen.getByText(blog.url)).toBeDefined()
})

test('like button calls handler twice', async () => {
	const handleLike = jest.fn()
	render(<Blog blog={blog} handleLike={handleLike} />)

	await userEvent.click(screen.getByText('view'))

	const likeBtn = screen.getByText('like')
	await userEvent.click(likeBtn)
	await userEvent.click(likeBtn)
	expect(handleLike.mock.calls).toHaveLength(2)
})
