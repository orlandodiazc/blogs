Cypress.Commands.add('login', ({ username, password }) => {
	cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
		username,
		password,
	}).then((response) => {
		localStorage.setItem('blogsUser', JSON.stringify(response.body))
		cy.visit('')
	})
})

Cypress.Commands.add('addBlog', (blog) => {
	cy.request({
		url: `${Cypress.env('BACKEND')}/blogs`,
		method: 'POST',
		body: blog,
		headers: {
			Authorization: `Bearer ${
				JSON.parse(localStorage.getItem('blogsUser')).token
			}`,
		},
	})

	cy.visit('')
})
