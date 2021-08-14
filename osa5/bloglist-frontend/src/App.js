import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const ListBlogs = ({ blogs, user, updateBlog, deleteBlog }) => {

  const sortedBlogs = blogs.sort( (a, b) => {return b.likes - a.likes})

  return (
    <div>
      <h2>blogs</h2>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} updateBlog = {updateBlog} deleteBlog = {deleteBlog} />
      )}
    </div>
  )
}

const Content = ({  user, blogs, handleLogin, username, password, handleUsernameChange,
  handlePasswordChange, handleLogout, createBlog, blogFormRef, updateBlog, deleteBlog }) => {

  if (user === null) {
    return (
      <LoginForm  username = {username}     password = {password}
        blogs = {blogs}           handleLogin = {handleLogin}
        handlePasswordChange = {handlePasswordChange}
        handleUsernameChange = {handleUsernameChange}
        usernameLabel="username"
      />
    )
  }
  return (
    <div>
      <p>Logged in as {user.name}</p><button onClick={handleLogout}>Logout</button>
      <Togglable buttonLabel="Add a new blog entry" ref={blogFormRef}>
        <BlogForm  createBlog = {createBlog} />
      </Togglable>
      <ListBlogs blogs = {blogs} user = {user} updateBlog = {updateBlog} deleteBlog = {deleteBlog} />
    </div>
  )
}

const DisplayMessage = ( { errorMessage, confirmationMessage }) => {
  if (errorMessage != null){
    return (
      <div className="error">
        <p>{errorMessage}</p>
      </div>
    )
  }
  if (confirmationMessage != null){
    return (
      <div className="confirmation">
        <p>{confirmationMessage}</p>
      </div>
    )
  }
  return (null)
}


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [confirmationMessage, setConfirmationMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setConfirmationMessage('Logged in succesfully')
      setTimeout(() => {
        setConfirmationMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blogObject) => {

    if(!window.confirm(`Are you sure you want to remove entry "${blogObject.title}" by ${blogObject.author}?`)){
      return
    }
    try {
      await blogService
        .deletion(blogObject.id)
      setBlogs(blogs.filter(blog => blog.id!==blogObject.id))
    }catch (exception){
      setErrorMessage('could not delete blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (blogObject, id) => {
    try {
      const result = await blogService
        .update(blogObject, id)
      setBlogs(blogs.map(blog => {
        if (blog.id === result.id) {
          return result
        }else{
          return blog
        }
      }))
      setConfirmationMessage('Like registered')
      setTimeout(() => {
        setConfirmationMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('could not update blog information')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const createBlog = async (blogObject) => {

    blogObject.user = user.id
    blogFormRef.current.toggleVisibility()
    try {
      const result = await blogService
        .create(blogObject)
      setBlogs(blogs.concat(result))

      setConfirmationMessage('New entry added!')
      setTimeout(() => {
        setConfirmationMessage(null)
      }, 5000)

    } catch (exception){
      setErrorMessage('Unable to create a new entry, be sure to fill all fields')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }
  const handleLogout = (event) => {
    setUsername('')
    setPassword('')
    window.localStorage.clear()
    blogService.setToken(null)
    setUser(null)

    setConfirmationMessage('Logged out succesfully')
    setTimeout(() => {
      setConfirmationMessage(null)
    }, 5000)
  }


  return (
    <div>
      <DisplayMessage errorMessage = {errorMessage} confirmationMessage = {confirmationMessage} />
      <Content          user = {user}           handleLogin = {handleLogin}
        username = {username}   password = {password}
        handleUsernameChange = {handleUsernameChange}   handlePasswordChange = {handlePasswordChange}
        blogs = {blogs}         handleLogout = {handleLogout}
        updateBlog = {updateBlog} deleteBlog = {deleteBlog}

        createBlog = {createBlog} blogFormRef = {blogFormRef}
      />
    </div>
  )
}

export default App