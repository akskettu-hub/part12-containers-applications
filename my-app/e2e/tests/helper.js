const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, content) => {
  await page.getByRole('button', { name: 'new blog' }).click()

  await page.locator('#title-input').fill(content.title)
  await page.locator('#author-input').fill(content.author)
  await page.locator('#url-input').fill(content.url)
  
  await page.getByRole('button', { name: 'create' }).click()
  //await page.getByText(content).waitFor()
}

export {loginWith, createBlog}