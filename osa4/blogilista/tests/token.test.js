const mongoose = require('mongoose')
const supertest = require('supertest')
const { response } = require('../app')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const loginRouter = require('../controllers/login')
const jwt = require('jsonwebtoken')

beforeEach( async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
})

testUser = {
    username: "Testman",
    name: "Test Man",
    password: "secret"
}

describe('Test env to formulate a test for tokens', () => {

    test('create user, login, post a blog', async () => {

        const addUser = await api
        .post('/api/users')
        .send(testUser)
        const userId = addUser.body.id.toString

        const loginInfo = {
            username: testUser.username,
            password: testUser.password
        }

        const result = await api
        .post('/api/login')
        .send(loginInfo)

        const token = result.body.token
       
        const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            user: userId._id
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(200)

        const blogsInDb = await Blog.find({})
        expect(blogsInDb.length).toBe(1)
    })



})

afterAll(() => {
    mongoose.connection.close()
  })