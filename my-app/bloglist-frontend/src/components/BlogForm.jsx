import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setBlogTitle] = useState('')
  const [author, setBlogAuthor] = useState('')
  const [url, setBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })

    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>

      <form onSubmit={addBlog}>
        <div>
          Title
          <input
            id='title-input'
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            id='author-input'
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          Url
          <input
            id='url-input'
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm