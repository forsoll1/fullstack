const mongoose = require('mongoose')
const supertest = require('supertest')
const { response } = require('../app')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  }
]
testUser = {
  username: "Testman",
  name: "Test Man",
  password: "secret"
}

beforeEach(async () => {

  await Blog.deleteMany({})
  await User.deleteMany({})

  const addUser = await api
  .post('/api/users')
  .send(testUser)
  const userId = addUser.body.id.toString

  const token = await getToken(testUser)
 
  const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      user: userId._id
  }

  const newBlog2 =   {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .set('Authorization', `bearer ${token}`)
  .expect(200)

  await api
  .post('/api/blogs')
  .send(newBlog2)
  .set('Authorization', `bearer ${token}`)
  .expect(200)

})



const getToken = async (userObj) => {

  const loginInfo = {
    username: userObj.username,
    password: userObj.password
  }

  const result = await api
  .post('/api/login')
  .send(loginInfo)
  const token = result.body.token

  return token
}

describe('4.8', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('GET correct number of blogs', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(initialBlogs.length)
  })
})

describe('4.9', () => {

  test('returned blog object has key "id" and no "_id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).toBe(undefined)
  })
})

describe('4.10', () => {

  test('POST request creates a new entry into database', async () => {

    const userRaw = await User.find({})
    const user = userRaw.map(u => u.toJSON())[0]

    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      user: user.id
    }

    const token = await getToken(testUser)

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)

    const response = await api.get('/api/blogs')
    const blogTitles = response.body.map(blog => blog.title)

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(blogTitles).toContain('Canonical string reduction')
    
  })
})

describe('4.11', () => {

  test('if no value for likes is given assign 0', async () => {

    const userRaw = await User.find({})
    const user = userRaw.map(u => u.toJSON())[0]

    const noLikes = {
      title: "No one could ever like this",
      author: "Ken Adams",
      url: "fakeurl.com",
      user: user.id
    }

    const token = await getToken(testUser)

    await api
      .post('/api/blogs')
      .send(noLikes)
      .set('Authorization', `bearer ${token}`)

    const response = await api.get('/api/blogs')
    const result = response.body.filter(blog => blog.author==="Ken Adams")[0]
    expect(result.likes).toBe(0) 
  })
})

describe('4.12', () => {

  test('if no title return code 400', async () => {

    const userRaw = await User.find({})
    const user = userRaw.map(u => u.toJSON())[0]

    const noTitle = {
      author: "Ken Adams",
      url: "fakeurl.com",
      likes: 0,
      user: user.id
    }

    const token = await getToken(testUser)

    await api
      .post('/api/blogs')
      .send(noTitle)
      .set('Authorization', `bearer ${token}`)
      .expect(400)
  })

  test('if no url return code 400', async () => {

    const userRaw = await User.find({})
    const user = userRaw.map(u => u.toJSON())[0]

    const noUrl = {
      title: "This is a title",
      author: "Ken Adams",
      likes: 0,
      user: user.id
    }

    const token = await getToken(testUser)

    await api
      .post('/api/blogs')
      .send(noUrl)
      .set('Authorization', `bearer ${token}`)
      .expect(400)
  })
})

describe('4.13', () => {

  test('Delete with id', async () => {
    const allBlogs = await api.get('/api/blogs')
    const deleteThisBlog = allBlogs.body[0]

    const token = await getToken(testUser)
    
    await api
      .delete(`/api/blogs/${deleteThisBlog.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const newBlogList = await api.get('/api/blogs')
    expect(newBlogList.body.length).toBe(initialBlogs.length-1)
    
    const idList = newBlogList.body.map(blog => blog.id)
    expect(idList).not.toContain(deleteThisBlog.id)
  })
})

describe('4.14', () => {

  test('Update title and likes, keep other values untouched', async () => {
    const newBlog = { 
      title:'UPDATED TITLE',
      likes: 198 }
    const allBlogs = await api.get('/api/blogs')
    const updateId = allBlogs.body[0].id

    await api
      .put(`/api/blogs/${updateId}`)
      .send(newBlog)
    
    const updatedBlogs = await api.get('/api/blogs')
    expect(updatedBlogs.body[0].title).toBe('UPDATED TITLE')
    expect(updatedBlogs.body[0].likes).toBe(198)
    expect(updatedBlogs.body[0].url).toBe(allBlogs.body[0].url)
  })
})

describe('4.28', () => {

  test('Blogs cannot be posted without token, results in 401', async () => {

    const userRaw = await User.find({})
    const user = userRaw.map(u => u.toJSON())[0]

    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      user: user.id
    }

    const blogsInDb = await Blog.find({})
    const blogs = blogsInDb.map(blog => blog.toJSON())
    const number = blogs.length

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

  })

})

afterAll(() => {
  mongoose.connection.close()
})