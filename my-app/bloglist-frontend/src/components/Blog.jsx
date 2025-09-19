import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateLike, userId, removeBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: detailsVisible ? 'none' : '' }
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }

  const handleLikeClick = () => {
    console.log('Updating blog:', blog.id)

    updateLike({
      updatedBlog: {
        user: blog.user.id,
        likes: blog.likes + 1,
        title: blog.title,
        author: blog.author,
        url: blog.url
      },
      blogId: blog.id
    })
  }

  const userIsBlogCreator = (blog.user.id === userId)
  const showWhencreator = { display: userIsBlogCreator ? '' : 'none' }

  const handleRemoveClick = () => {
    console.log('clicked remove')

    window.confirm(`Are you sure you want to remove ${blog.title} by ${blog.author}` )
      ? removeBlog(blog.id)
      : console.log('clicked cancel remove')
  }

  return (
    <div data-testid='blog-item' style={blogStyle}>
      <div className='DetailsHidden' style={hideWhenVisible}>
        {blog.title} {blog.author}

        <button onClick={() => setDetailsVisible(true)}>view</button>

      </div>
      <div className='DetailsShown' style={showWhenVisible}>
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setDetailsVisible(false)}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          {`Likes: ${blog.likes}`}
          <button onClick={handleLikeClick}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <button data-testid='remove-button' onClick={handleRemoveClick} style={showWhencreator}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  updateLike: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  blog: PropTypes.object.isRequired
}

export default Blog