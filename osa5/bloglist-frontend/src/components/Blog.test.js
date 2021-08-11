import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'


const blog = {
  title: 'Title of tested blog',
  author: 'Mr. Author',
  url: 'www.isvalid.com',
  likes: 12,
}

const user = {
  name: 'User Name'
}

const mockHandler = jest.fn()
const pressLike = jest.fn()
const deleteBlog = jest.fn()

describe('5.13', () => {
  test('renders content', () => {

    const component = render(
      <Blog blog={blog} setViewInfo={mockHandler} user={user} updateBlog = {pressLike} deleteBlog = {deleteBlog} />
    )

    expect(component.container).toHaveTextContent(
      'Title of tested blog'
    )
    expect(component.container).toHaveTextContent(
      'Mr. Author'
    )
    expect(component.container).not.toHaveTextContent(
      'www.isvalid.com'
    )
  })
})

describe('5.14', () => {
  test('clicking "view" displays more blog information', async () =>  {

    const component = render(
      <Blog blog={blog} setViewInfo={mockHandler} user={user} updateBlog = {pressLike} deleteBlog = {deleteBlog} />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(
      'www.isvalid.com'
    )
    expect(component.container).toHaveTextContent(
      '12'
    )
  })
})

describe('5.15', () => {
  test('when "like" button is pressed twice the associated event handler gets called twice', async () =>  {

    const component = render(
      <Blog blog={blog} setViewInfo={mockHandler} user={user} updateBlog = {pressLike} deleteBlog = {deleteBlog} />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(pressLike.mock.calls).toHaveLength(2)
  })
})
