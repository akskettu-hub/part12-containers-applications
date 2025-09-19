const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const {userExtractor} = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  if (!request.user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: request.user._id
  })

  const savedBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog._id)  
  await request.user.save()

  const populatedBlog = await savedBlog.populate('user') 

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json(({ error: 'unknown endpoint' }))
  }

  if (blog.user.toString() !== request.user.id.toString()) {
    return response.status(401).json({ error: 'blogs can only be deleted by their creators' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = await Blog.findById(request.params.id)

  if (blog) {
    blog.title = body.title
    blog.author = body.author
    blog.url = body.url
    blog.likes = body.likes
    //blog.user = body.user

    const updatedBlog = await blog.save()
    const populatedBlog = await updatedBlog.populate('user')

    response.json(populatedBlog)

  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter