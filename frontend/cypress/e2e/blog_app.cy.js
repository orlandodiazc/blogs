describe('Blog app', function () {
	beforeEach(function () {
		cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
		cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
			name: 'admin',
			username: 'root',
			password: '1234',
		})
		cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
			name: 'guest',
			username: 'guest',
			password: '4321',
		})
		cy.visit('')
	})

	it('front page can be opened', function () {
		cy.contains('Blogs')
	})

	it('login form is shown', function () {
		cy.contains('log in').click()
		cy.get('#username').should('exist')
		cy.get('#password').should('exist')
		cy.contains('Login')
		cy.contains('cancel')
	})

	describe('Login', function () {
		it('succeeds with correct credentials', function () {
			cy.contains('log in').click()
			cy.get('#username').type('root')
			cy.get('#password').type('1234')

			cy.contains('Login').click()
			cy.contains('admin logged in')
		})

		it('fails with wrong credentials', function () {
			cy.contains('log in').click()
			cy.get('#username').type('root')
			cy.get('#password').type('3214')

			cy.contains('Login').click()
			cy.contains('Wrong credentials').should('have.css', 'color', 'rgb(255, 0, 0)')

			cy.get('html').should('not.contain', 'admin logged in')
		})
	})

	describe('when logged in', function () {
		beforeEach(function () {
			cy.login({ username: 'root', password: '1234' })
		})

		it('a new blog can be created', function () {
			cy.contains('Add new blog').click()
			cy.get('label').contains('title:').find('input').type('blog created')
			cy.get('label').contains('author:').find('input').type('orlando')
			cy.get('label').contains('url:').find('input').type('page.com')

			cy.contains('submit').click()

			cy.contains('blog created')
			cy.contains('orlando')
		})

		describe('view more blog information flow', function () {
			beforeEach(function () {
				cy.addBlog({ title: 'test1', author: 'orlando', url: 'page.com/1' })
			})
			it('view shows more information and like button works', function () {
				cy.contains('view').click()
				cy.contains('page.com/1')

				cy.contains('likes: 0')
				cy.contains('like').click()
				cy.contains('likes: 1')
			})

			it('removing a blog works', function () {
				cy.contains('view').click()
				cy.contains('remove').click()
				cy.contains('test1').should('not.exist')
			})

			it('removing a blog with a different user does not work', function () {
				cy.contains('logout').click()
				cy.login({ username: 'guest', password: '4321' })
				cy.contains('remove').should('not.exist')
			})
		})
		describe('multiple blogs created', function () {
			it.only('sorting by likes', function () {
				cy.addBlog({ title: 'the last one', author: 'orlando', url: 'page.com/1', likes: 3 })
				cy.addBlog({ title: 'most likes', author: 'andres', url: 'page.com/2', likes: 21 })
				cy.addBlog({ title: 'second most likes', author: 'juan', url: 'page.com/3', likes: 8 })

				cy.get('ul>li').eq(0).should('contain', 'most likes')
				cy.get('ul>li').eq(1).should('contain', 'second most likes')
				cy.get('ul>li').eq(2).should('contain', 'the last one')
			})
		})
	})
})
