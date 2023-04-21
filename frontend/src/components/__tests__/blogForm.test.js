import { render, screen } from '@testing-library/react'
import BlogForm from '../BlogForm'
import userEvent from '@testing-library/user-event'

const newBlog = {
	title: 'new york',
	author: 'usuario',
	url: 'website.com',
}

test('form calls handler and sends correct details', async () => {
	const handleNewBlog = jest.fn()
	render(<BlogForm handleNewBlog={handleNewBlog} />)

	await userEvent.type(screen.getByLabelText('title:'), newBlog.title)
	await userEvent.type(screen.getByLabelText('author:'), newBlog.author)
	await userEvent.type(screen.getByLabelText('url:'), newBlog.url)
	await userEvent.click(screen.getByText('submit'))

	expect(handleNewBlog.mock.calls).toHaveLength(1)
	expect(handleNewBlog.mock.calls[0][0]).toEqual(newBlog)
})
