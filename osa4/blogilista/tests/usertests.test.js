const mongoose = require('mongoose')
const supertest = require('supertest')
const { response } = require('../app')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Blog = require('../models/blog')

const initialUsers = [{
        username: 'one',
        name: 'Ken Adams',
        password: '12345'
    },
    {
        username: 'two',
        name: 'John Adams',
        password: 'qwerty'
    }
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

beforeEach( async () => {
    await User.deleteMany({})
    await api
    .post('/api/users')
    .send(initialUsers[0])
    await api
    .post('/api/users')
    .send(initialUsers[1])
    await Blog.deleteMany({})
})

describe('Basic tests', () => {

    test('User creation adds a document to database', async () => {

        const testUser = {
            username: 'test',
            name: 'test',
            password: 'password'
        }

        await api
        .post('/api/users')
        .send(testUser)
        .expect(200)

        const getUsers = await usersInDb()
        expect(getUsers.length).toBe(initialUsers.length + 1)
    })

    test('No duplicate usernames', async () => {

        const testUser = {
            username: 'one',
            name: 'test',
            password: 'password'
        }

        await api
        .post('/api/users')
        .send(testUser)
        .expect(400)

        const getUsers = await usersInDb()
        expect(getUsers.length).toBe(initialUsers.length)
    })
    test('Name must be at least 3 characters long', async () => {

        const testUser = {
            username: 'ab',
            name: 'test',
            password: 'password'
        }

        const result = await api
        .post('/api/users')
        .send(testUser)
        .expect(400)

        expect(result.body.error).toContain('Invalid username')

        const getUsers = await usersInDb()
        expect(getUsers.length).toBe(initialUsers.length)
    })
    test('Password must be at least 3 characters long', async () => {

        const testUser = {
            username: 'test',
            name: 'test',
            password: 'pa'
        }

        const result = await api
        .post('/api/users')
        .send(testUser)
        .expect(400)

        expect(result.body.error).toContain('Password must be at least three characters long')

        const getUsers = await usersInDb()
        expect(getUsers.length).toBe(initialUsers.length)
    })
})

describe('Tests for connecting database collections with userid', () => {

    test('reference to blog entry is recorded into "user"-document', async () => {

        testUser = {
            username: "Testman",
            name: "Test Man",
            password: "secret"
        }

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
            title: "Test for userid",
            author: "Ken Adams",
            url: "www.www.fi",
            likes: 3,
            user: userId
        }

        await api
        .post ('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)

        const updatedUsers = await usersInDb()
        const updatedUser = updatedUsers[2]
        expect(updatedUser.blogs.length).toBe(1)
    })
})

afterAll(() => {
    mongoose.connection.close()
})