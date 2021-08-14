import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const handleBlogTitleChange = (event) => {
    setBlogTitle(event.target.value)
  }
  const handleBlogAuthorChange = (event) => {
    setBlogAuthor(event.target.value)
  }
  const handleBlogUrlChange = (event) => {
    setBlogUrl(event.target.value)
  }


  const addBlog = async (event) => {
    event.preventDefault()
    let blogObject = {
      title : blogTitle,
      author : blogAuthor,
      url : blogUrl,
    }

    createBlog(blogObject)
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <h2>Add new blog</h2>
      <form onSubmit={addBlog}>
        <div>
            Title:
          <input
            id='title'
            type="text"
            value={blogTitle}
            name="blogTitle"
            onChange={handleBlogTitleChange}
          />
        </div>
        <div>
            Author:
          <input
            id='author'
            type="text"
            value={blogAuthor}
            name="blogAuthor"
            onChange={handleBlogAuthorChange}
          />
        </div>
        <div>
            Url:
          <input
            id='url'
            type="text"
            value={blogUrl}
            name="blogUrl"
            onChange={handleBlogUrlChange}
          />
        </div>
        <button id="addBlog" type="submit">Add</button>
      </form>
    </div>
  )
}

export default BlogForm


