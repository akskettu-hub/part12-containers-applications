const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helperArrays = require('../utils/list_helper_arrays')


test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(helperArrays.blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(helperArrays.listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list many blog, equals the likes of those', () => {
    const result = listHelper.totalLikes(helperArrays.blogs)
    assert.strictEqual(result, 36)
  })
})

describe('Favourite blog', () => {
  test('Blog with most likes, when there is only one blog', () => {
    const result = listHelper.favouriteBlog(helperArrays.listWithOneBlog)
    assert.deepStrictEqual(result, helperArrays.listWithOneBlog[0])
  })

  test('Blog with most likes, when there are many blog', () => {
    const result = listHelper.favouriteBlog(helperArrays.blogs)
    assert.deepStrictEqual(result, helperArrays.blogs[2])
  })
})

describe('Most Blogs', () => {
  test('Most blogs when there is one blog', () => {
    const result = listHelper.mostBlogs(helperArrays.listWithOneBlog)
    //console.log(result)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 1
    })
  })

  test('Most blogs when there are many blogs', () => {
    const result = listHelper.mostBlogs(helperArrays.blogs)
    //console.log(result)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3
    })
  })

  test('Most blogs when there are many blogs, with a different array', () => {
    const result = listHelper.mostBlogs(helperArrays.blogs2)
    //console.log(result)
    assert.deepStrictEqual(result, {
      author: "Michael Chan",
      blogs: 3
    })
  })
})

describe('Most Likes', () => {
  test('Most likes when there is one blog', () => {
    const result = listHelper.mostLikes(helperArrays.listWithOneBlog)
    //console.log(result)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 5
    })
  })

  test('Most likes when there are many blogs', () => {
    const result = listHelper.mostLikes(helperArrays.blogs)
    //console.log(result)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })

  test('Most likes when there are many blogs, with a different array', () => {
    const result = listHelper.mostLikes(helperArrays.blogs2)
    //console.log(result)
    assert.deepStrictEqual(result, {
      author: "Michael Chan",
      likes: 17
    })
  })
})