const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
    return blogs.reduce((maxLikes, blog) => maxLikes.likes > blog.likes ? maxLikes : blog, -1)
}

const mostBlogs = (blogs) => {
    let authors = []
    
    for (let i = 0; i < blogs.length; i++) {
        
        authorInAuthors = authors.find(item => item.author === blogs[i].author)
        if (!authorInAuthors) {
            // Author not in authors. push an element to authors. blogs initialised as 1
            let authorObj = { author: blogs[i].author, blogs: 1}
            authors.push(authorObj)
        } else {
            // Increment the blogs field of the apporiate author
            authorInAuthors.blogs +=1
        }
    }
    //console.log(authors)
    return authors.reduce((maxBlogs, author) => maxBlogs.blogs < author.blogs ? author : maxBlogs )
}

/*Define a function called mostLikes that receives an array of blogs as its parameter. The function returns the author, whose blog posts have the largest amount of likes. The return value also contains the total number of likes that the author has received: */

const mostLikes = (blogs) => {
    let authors = {}

    for (const blog of blogs) {
        if (!authors.hasOwnProperty(blog.author)){
            authors[blog.author] = blog.likes
        } else {
            authors[blog.author] += blog.likes
        }
    }

    let maxAuthor = ''
    let maxLikes = 0

    for (const author in authors) {
        if (authors[author] > maxLikes) {
            maxAuthor = author
            maxLikes = authors[author]
        }
    }

    return {author: maxAuthor, likes: maxLikes}
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}