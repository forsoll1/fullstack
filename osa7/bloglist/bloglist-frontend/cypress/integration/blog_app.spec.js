describe('Blog app', function() {
  beforeEach(function() {

    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'secure'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')

  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('secure')
      cy.get('#loginButton').click()
  
      cy.contains('Logged in as')
    })
  
    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrong_password')
      cy.get('#loginButton').click()
  
      cy.get('.error').contains('wrong credentials')
      cy.get('html').should('not.contain', 'Logged in')
    })
  })



  describe('When logged in', function () {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'testuser', password: 'secure'
      }).then(response => {
        localStorage.setItem('loggedNoteappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })
    it('A blog can be created', function() {
      cy.contains('Add a new blog entry').click()
      cy.get('#title').type('testtitle')
      cy.get('#author').type('testauthor')
      cy.get('#url').type('testurl')
      cy.get('#addBlog').click()

      cy.get('.confirmation').contains('New entry')
      cy.get('.blogSmall').contains('testtitle')
    })

    describe('After a blog has been created', function() {
      beforeEach(function() {
        cy.contains('Add a new blog entry').click()
        cy.get('#title').type('testtitle')
        cy.get('#author').type('testauthor')
        cy.get('#url').type('testurl')
        cy.get('#addBlog').click()
      })
      it('You can add a like to a blog', function() {
        cy.get('#viewButton').click()
        cy.get('html').contains('likes: 0')
        cy.get('#likeButton').click()
        cy.get('html').contains('likes: 1')
      })
      it('You can remove a blog', function() {
        cy.get('.blogSmall').contains('testtitle')
        cy.get('#viewButton').click()
        cy.get('#deleteButton').click()
        cy.get('html').should('not.contain', '.blogSmall')
      })
      it('Blogs are ordered based on amount of likes', function() {
        cy.get('#viewButton').click()
        cy.get('#likeButton').click()
        cy.get('#viewButton').click()


        cy.contains('Add a new blog entry').click()
        cy.get('#title').type('secondblog')
        cy.get('#author').type('testauthor')
        cy.get('#url').type('testurl')
        cy.get('#addBlog').click()

        cy.wait(500)

        cy.get('html').find('.blogSmall')
          .eq(0)
          .should('contain.text', 'testtitle')

        cy.get('.blogSmall')
          .eq(1)
          .should('contain.text', 'secondblog')
          .contains('view').click()
        cy.contains('secondblog')
          .contains('like').click()
        cy.wait(500)
        cy.contains('secondblog')
          .contains('like').click()
        cy.wait(500)

        cy.get('.blogSmall')
          .eq(0)
          .should('contain.text', 'secondblog')
      })
    })

  })
})

