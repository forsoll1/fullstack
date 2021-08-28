import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import { notification } from './reducers/notificationReducer'
import { setUser, loginUser, removeUser } from './reducers/userReducer'
import { setuserList } from './reducers/userlistReducer'
import { useDispatch, useSelector } from 'react-redux'
import { createAction, deleteAction, initializeBlogs, updateAction } from './reducers/blogReducer'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

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

const Content = ({ userList, user, blogs, handleLogin, username, password, handleUsernameChange,
  handlePasswordChange, createBlog, blogFormRef, updateBlog, deleteBlog }) => {

  const listOfUserUrls = userList.map(user => ({
    url:`/users/${user.id}`,
    id:user.id
  }))

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

    <Switch>
      {listOfUserUrls.map(userInfo =>
        <Route key={userInfo.id} path={userInfo.url}>
          <UserBlogs  id={userInfo.id} userList={userList} />
        </Route>
      )}
      <Route path="/users">
        <UserList userList = {userList}/>
      </Route>
      <Route path="/">
        <div>
          <Togglable buttonLabel="Add a new blog entry" ref={blogFormRef}>
            <BlogForm  createBlog = {createBlog} />
          </Togglable>
          <ListBlogs blogs = {blogs} user = {user} updateBlog = {updateBlog} deleteBlog = {deleteBlog} />
        </div>
      </Route>
    </Switch>
  )
}

const UserList = ( { userList }) => {

  const userUrl = (user) => {
    return `/users/${user.id}`
  }

  return(
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(user =>
            <tr key={user.id}>
              <th><Link to={userUrl(user)}>{user.name}</Link></th>
              <th>{user.blogs.length}</th>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const UserBlogs = ( { userList, id } ) => {
  const user = userList.find(user => user.id === id)
  return(
    <div>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>
    </div>
  )
}

const Navigation = ( { handleLogout, user } ) => {

  const padding = {
    padding: 5
  }
  return(
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/">home</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/users">users</Link>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setuserList())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
    }
  }, [dispatch])

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const userList  = useSelector(state => state.userList)

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(loginUser({ username, password }))
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    setUsername('')
    setPassword('')
  }



  const deleteBlog = (blogObject) => {
    if(!window.confirm(`Are you sure you want to remove entry "${blogObject.title}" by ${blogObject.author}?`)){
      return
    }
    dispatch(deleteAction(blogObject, blogs))
  }
  const updateBlog = (blogObject, id) => {
    dispatch(updateAction(blogObject, id, blogs))
  }
  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createAction(blogObject, user, blogs))
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
    dispatch(removeUser())
    dispatch(notification('Logged out successfully!', 'confirmation'))
  }


  return (
    <div className="container">
      <Router>
        <Notification />
        {user? <Navigation user={user}/> :null}
        {user? <div><p>Logged in as {user.name}</p><button onClick={handleLogout}>Logout</button></div> :null}
        <div>
          <Content
            user = {user}               handleLogin = {handleLogin}
            username = {username}       password = {password}
            blogs = {blogs}             userList = {userList}
            updateBlog = {updateBlog}   deleteBlog = {deleteBlog}
            createBlog = {createBlog}   blogFormRef = {blogFormRef}

            handleUsernameChange = {handleUsernameChange}
            handlePasswordChange = {handlePasswordChange}
          />
        </div>
      </Router>
    </div>
  )
}

export default App