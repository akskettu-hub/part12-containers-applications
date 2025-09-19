const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const testHelper = require('../utils/test_helper')

const api = supertest(app)

describe('api tests', () => {
    describe('when there are blogs in db initially', () => {
        beforeEach(async () => {
            await Blog.deleteMany({})

            const blogObjects = testHelper.initalBlogs
                .map(blog => new Blog(blog))

            const promiseArray = blogObjects.map(blog => blog.save())
            await Promise.all(promiseArray)
        })

        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
            })

        test('all blog are returned', async () => {
            const response = await api.get('/api/blogs')
            assert.strictEqual(response.body.length, testHelper.initalBlogs.length)
        })

        test('all blogs contain unique id property called id', async () => {
            const response = await api.get('/api/blogs')
            assert.strictEqual(response.body.every(blog => Object.hasOwn(blog, "id")), true)
            })

        test('A specific blog can be found with id', async () => {
            const blogs = await api.get('/api/blogs')
            const blogToView = blogs.body[0]
            const id = blogToView.id
        
            const response = await api.get(`/api/blogs/${id}`)
            
            assert.deepStrictEqual(response.body, blogToView)
        })
    })    

    describe('Adding a new blog', () => {
        beforeEach(async () => {
            await Blog.deleteMany({})
            await User.deleteMany({})
            await User.ensureIndexes() // This makes sure inecies are included. needed to make username uniqueness check work
            const rootUser = await testHelper.initialiseRootUser()
            await rootUser.save() 
        })

        test('succeeds with status code 201 with valid data and token', async () => {
            const token = await testHelper.getRootAuth(api)

            const firstResponse = await api.get('/api/blogs')
            const initialBlogsLength = firstResponse.body.length
            const blogObject = testHelper.oneBlog

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(blogObject)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const secondResponse = await api.get('/api/blogs')
        
            assert.strictEqual(secondResponse.body.length, initialBlogsLength + 1)
        })

        test('If likes property is missing from post request, defaults to 0', async () => {
            const token = await testHelper.getRootAuth(api)
            
            const response = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(testHelper.missingLikesBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.likes, 0)
        })

        test('Missing title property returns 400', async () => {
            const token = await testHelper.getRootAuth(api)

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(testHelper.missingTitleBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/)
        })

        test('Missing URL property returns 400', async () => {
            const token = await testHelper.getRootAuth(api)

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(testHelper.missingUrlBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/)
        })

        test('fails when token is missing with status code 401', async () => {
            await api
                .post('/api/blogs')
                .send(testHelper.oneBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)
        })
    })

    describe('Deleting a blog', () => {
        beforeEach(async () => {
            await Blog.deleteMany({})
            await User.deleteMany({})
            await User.ensureIndexes() // This makes sure inecies are included. needed to make username uniqueness check work
            const rootUser = await testHelper.initialiseRootUser()
            await rootUser.save()

            const user = await User.findOne( rootUser )

            const blogObjects = testHelper.blogsWithUser(user.id)

            const promiseArray = blogObjects.map(blog => blog.save())
            await Promise.all(promiseArray)            
        })

        test('succesfully removes an existing post with status code 204 when token is valid', async ()=> {
            const blogsAtStart = await api.get('/api/blogs')
            
            const blogId = blogsAtStart.body[0].id
            
            const token = await testHelper.getRootAuth(api)
            
            await api
                .delete(`/api/blogs/${blogId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)
            
            const blogsAtEnd = await api.get('/api/blogs')
            const idsAtEnd = blogsAtEnd.body.map(blog => blog.id)
            
            assert(!idsAtEnd.includes(blogId))
            assert.strictEqual(blogsAtStart.body.length - 1, blogsAtEnd.body.length)
        })

        test('fails with status code 401 when token is missing', async ()=> {
            const blogsAtStart = await api.get('/api/blogs')
            
            const blogId = blogsAtStart.body[0].id
                        
            await api
                .delete(`/api/blogs/${blogId}`)
                .expect(401)
            
            const blogsAtEnd = await api.get('/api/blogs')
            const idsAtEnd = blogsAtEnd.body.map(blog => blog.id)
            
            assert(idsAtEnd.includes(blogId))
            assert.strictEqual(blogsAtStart.body.length , blogsAtEnd.body.length)
        })

        test('Deleting a blog with an invalid blog id fails with status code 400', async () => {
            const token = await testHelper.getRootAuth(api)
            
            await api
                .delete('/api/blogs/abcd1234')
                .set('Authorization', `Bearer ${token}`)
                .expect(400)
        })

        test('Deleting a blog with a non-existent valid id fails with status code 404', async () => {
            await api
                .delete(`/api/blogs/${testHelper.nonExistingId}`)
                .expect(404)
        })
    })

    describe('Updating a blog', () => {
        beforeEach(async () => {
            await Blog.deleteMany({})
            await User.deleteMany({})
            await User.ensureIndexes() // This makes sure inecies are included. needed to make username uniqueness check work
            const rootUser = await testHelper.initialiseRootUser()
            await rootUser.save()

            const user = await User.findOne( rootUser )

            const blogObjects = testHelper.blogsWithUser(user.id)

            const promiseArray = blogObjects.map(blog => blog.save())
            await Promise.all(promiseArray)            
        })
        test('Updating a blog succeeds with status code 200 with valid data', async () => {
            const blogsAtStart = await api.get('/api/blogs')
            const blogToUpdate = blogsAtStart.body[0]

            blogToUpdate.likes = 999

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogToUpdate)
                .expect(200)

            const responseUpdateBlog = await api.get('/api/blogs')
            const updatedBlog = responseUpdateBlog.body[0]

            assert.deepStrictEqual(blogToUpdate, updatedBlog)
        })

        test('Updating a blog fails with status code 400 with invalid data', async () => {
            const blogsAtStart = await api.get('/api/blogs')
            const blogToUpdate = blogsAtStart.body[0]

            blogToUpdate.likes = 'invalid data'

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogToUpdate)
                .expect(400)
        })

        test('Updating a blog fails with status code 404 with invalid id', async () => {
            const blogsAtStart = await api.get('/api/blogs')
            const blogToUpdate = blogsAtStart.body[0]

            blogToUpdate.likes = 999

            await api
                .put(`/api/blogs/${testHelper.nonExistingId}`)
                .send(blogToUpdate)
                .expect(404)
        })
    })

    describe('when there are two users in database initially', () => {
        beforeEach(async () => {
            await User.deleteMany({})
            await User.ensureIndexes() // This makes sure inecies are included. needed to make username uniqueness check work
            await User.insertMany(testHelper.initialUsers)
        })

        test('all users are returned with status code 200', async () => {
            const response = await api
                .get('/api/users')
                .expect(200)
            
            assert.strictEqual(response.body.length, testHelper.initialUsers.length)
        })

        test('POST request with valid data succeed with status code 201', async () => {
            const usersAtStart = await testHelper.usersInDb() 
            
            const newUser = {
                username: "testy",
                name: "testy testerson",
                password: "passoword123",
            }
            
            const response = await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await testHelper.usersInDb()
            assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length)
        })

        test('Invalid username fails with status code 400, with proper error message', async () => {
            const usersAtStart = await testHelper.usersInDb() 
            
            const newUser = {
                username: "abc",
                name: "abc",
                password: "passoword123",
            }

            const response = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            assert.strictEqual(response.body.error, 'username must be at least 3 characters long')

            const usersAtEnd = await testHelper.usersInDb()
            assert.strictEqual(usersAtStart.length, usersAtEnd.length)
        })

        test('Invalid password fails with status code 400, with proper error message', async () => {
            const usersAtStart = await testHelper.usersInDb() 
            
            const newUser = {
                username: "abcd",
                name: "abc",
                password: "123",
            }

            const response = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            assert.strictEqual(response.body.error, 'password must be at least 3 characters long')

            const usersAtEnd = await testHelper.usersInDb()
            assert.strictEqual(usersAtStart.length, usersAtEnd.length)
        })

        test('creation fails with username already in db, with status code 400 and proper error message', async () => {
            const usersAtStart = await testHelper.usersInDb()      

            const response = await api
                .post('/api/users')
                .send(testHelper.initialUsers[0])
                .expect(400)

            assert.strictEqual(response.body.error, 'expected `username` to be unique')

            const usersAtEnd = await testHelper.usersInDb()
            assert.strictEqual(usersAtStart.length, usersAtEnd.length)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})