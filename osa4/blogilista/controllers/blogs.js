const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
    
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  const token = request.token
  if(!token){
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!body.likes){
    body.likes = 0
  }
  if (!body.title||!body.url){
    return response.status(400).send({ error: 'Bad Request'})
  }

  const blog = new Blog({
      title:body.title,
      author:body.author,
      url:body.url,
      likes:body.likes,
      user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {

  const user = request.user
  const token = request.token
  if(!token){
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const userId = user._id
  const toBeDeleted = await Blog.findById(request.params.id)
  if (userId.toString !== toBeDeleted.user.toString){
    return response.status(401).json({ error: 'only the creator of a blogpost can delete said post' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const keys = Object.keys(body)

  const blog = {}
  keys.forEach(key => {
    blog[`${key}`] = body[`${key}`]    
  });

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.json(updatedBlog.toJSON())
})


module.exports = blogsRouter