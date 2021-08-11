import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('5.16', () => {
  test('When creating a new blog, check that handler gets called with correct parameters', async () => {
    const createBlog = jest.fn()

    const component = render(
      <BlogForm createBlog={createBlog} />
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, { target: { value: 'testTitle' } })
    fireEvent.change(author, { target: { value: 'testAuthor' } })
    fireEvent.change(url, { target: { value: 'testUrl' } })

    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testTitle')
    expect(createBlog.mock.calls[0][0].author).toBe('testAuthor')
    expect(createBlog.mock.calls[0][0].url).toBe('testUrl')
  })
})