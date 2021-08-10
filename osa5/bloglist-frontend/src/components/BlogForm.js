import React, {useState} from 'react' 

const BlogForm = ({ createBlog, user}) => {

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
            user : user.id
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
              type="text"
              value={blogTitle}
              name="blogTitle"
              onChange={handleBlogTitleChange}
            />
          </div>
          <div>
            Author:  
              <input
              type="text"
              value={blogAuthor}
              name="blogAuthor"
              onChange={handleBlogAuthorChange}
            />
          </div>
          <div>
            Url:  
              <input
              type="text"
              value={blogUrl}
              name="blogUrl"
              onChange={handleBlogUrlChange}
            />
          </div>
          <button type="submit">Add</button>
        </form>
        </div>
      )
}

export default BlogForm


