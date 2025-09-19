import { render, screen, within } from '@testing-library/react'
import BlogForm from './BlogForm'
import { beforeEach, describe, test } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  const title = 'This is a test'
  const author = 'Some Guy'
  const url = 'blog.com/something'


  const mockCreateBlog = vi.fn()

  let container

  beforeEach(() => {
    container = render(
      <BlogForm
        createBlog={mockCreateBlog}
      />
    ).container
  })

  test('when create is clicked, event handler passed as prop is called.', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('create')
    await user.click(button)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
  })

  test('when create is clicked, proper details are pased to the handler', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('create')
    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')

    await user.type(titleInput, 'testing a form...')
    await user.type(authorInput, 'Some Guy')
    await user.type(urlInput, 'blog.com/something')

    await user.click(button)

    expect(mockCreateBlog.mock.calls).toHaveLength(2)

    expect(mockCreateBlog.mock.calls[1][0].title).toBe('testing a form...')
    expect(mockCreateBlog.mock.calls[1][0].author).toBe('Some Guy')
    expect(mockCreateBlog.mock.calls[1][0].url).toBe('blog.com/something')
  })
})