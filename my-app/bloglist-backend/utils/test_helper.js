const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initalBlogs = [
    {
        title: "Gleaming the Cube",
        author: "Michael Trapezoid",
        url: "blog.com/cube_trapezoid",
        likes: 8,
    },
    {
        title: "Running Backend",
        author: "John James",
        url: "blog.com/running_backend_james",
        likes: 1,
    },
    {
        title: "Beans",
        author: "Gerals Garbanzo",
        url: "blog.com/beans",
        likes: 12,
    },
    {
        title: "More on Beans, by popular request",
        author: "Gerald Garbanzo",
        url: "blog.com/beans2",
        likes: 24,
    }
]

const oneBlog = {
    title: "Even more on beans. At this point, even I'm tired of writing about beans",
    author: "Gerald Garbanzo",
    url: "blog.com/beans2",
    likes: 12,
}

const missingLikesBlog = {
    title: "Beans: Redux",
    author: "Gerald Garbanzo",
    url: "blog.com/beansredux",
}

const missingTitleBlog = {
    author: "Gerald Garbanzo",
    url: "blog.com/beans2",
    likes: 12,
}

const missingUrlBlog = {
    title: "Beans: Redux",
    author: "Gerald Garbanzo",
    likes: 12,
}

const initialUsers = [
    {
        username: 'root',
        name: 'Superuser',
        password: 'password987987'
    },
    {
        username: 'Jim Bean',
        name: 'James Bean',
        password: 'beansbeansbeans'
    },
]

const nonExistingId = async () => {
  const blog = new Blog({ 
    title: "temp title",
    author: "temp name",
    url: "blog.com/temp",
    likes: 55,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const initialiseRootUser = async () => {
    const passwordHash = await bcrypt.hash('password987987', 10)
    
    const rootUser = new User({
        username: 'root',
        name: 'Superuser',
        passwordHash
    })

    return rootUser
}

const getRootAuth = async (api) => {
    const loginInfo = {
        username: 'root',
        password: 'password987987',
    }
    
    const response = await api
        .post('/api/login')
        .send(loginInfo)

    return response.body.token
}

const blogsWithUser = (userId) => {
    const blogs = initalBlogs
        .map(blog => ({...blog, user: userId}))
    
    const blogObjects = blogs
        .map(blog => new Blog(blog))

    return blogObjects
}

module.exports = {
    initalBlogs,
    oneBlog,
    missingLikesBlog,
    missingTitleBlog,
    missingUrlBlog,
    nonExistingId,
    blogsInDb,
    initialUsers,
    usersInDb,
    initialiseRootUser,
    getRootAuth,
    blogsWithUser,
}