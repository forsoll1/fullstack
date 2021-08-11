import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {

  const [viewInfo, setViewInfo] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likedBlog = {
    likes:blog.likes+1
  }

  const blogInfo = () => {
    return(
      <div>
        {blog.url}
        <br></br>
        likes: {blog.likes}<button onClick={ () => updateBlog(likedBlog, blog.id)}>like</button>
        <br></br>
        {user.name}
        <br></br>
        <button onClick={() => deleteBlog(blog)}>Remove blog entry</button>
      </div>
    )
  }

  return(
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick = { () => setViewInfo(!viewInfo)}>{viewInfo ? 'hide' : 'view'}</button>
      {viewInfo ? blogInfo() : null }
    </div>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}

export default Blog