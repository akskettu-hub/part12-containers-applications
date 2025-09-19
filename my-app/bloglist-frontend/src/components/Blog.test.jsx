import { render, screen, within } from '@testing-library/react'
import Blog from './Blog'
import { beforeEach, describe } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  const blog = {
    title: 'This is a test',
    author: 'Some Guy',
    url: 'blog.com/something',
    id: 'asdlfkjosef09823408',
    user: {
      id: '203948203948',
      name: 'Aname',
      username:'username123'
    },
    likes: 6
  }

  const mockUpdateLike = vi.fn()
  const mockRemoveBlog = vi.fn()
  const userId = '1234567kujsdhf'

  let container

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        updateLike={mockUpdateLike}
        removeBlog={mockRemoveBlog}
        userId={userId}
      />
    ).container
  })

  test('contains title by default', async () => {
    await screen.findAllByText(/This is a test/)
  })

  test('contains author by default', async () => {
    await screen.findAllByText(/Some Guy/)
  })

  test('render blog title and author by default', () => {
    const div = container.querySelector('.DetailsHidden')
    expect(div).not.toHaveStyle('display: none')
  })

  test('does not render blog details by default', () => {
    const div = container.querySelector('.DetailsShown')
    expect(div).toHaveStyle('display: none')
  })

  test('url not in shown section', () => {
    const div = container.querySelector('.DetailsHidden')
    const scope = within(div)
    expect(scope.queryByText(blog.url)).toBeNull()
  })

  test('likes not in shown section', () => {
    const div = container.querySelector('.DetailsHidden')
    const scope = within(div)
    expect(scope.queryByText('Likes:')).toBeNull()
  })

  test('after clicking the button, details are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.DetailsShown')
    expect(div).not.toHaveStyle('display: none')
  })

  test('when like button is clicked twice, handler is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockUpdateLike.mock.calls).toHaveLength(2)
  })
})
