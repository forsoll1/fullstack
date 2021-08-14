import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ username, password, handleLogin, handleUsernameChange, handlePasswordChange, usernameLabel }) => {

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          {usernameLabel}
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
          />
        </div>
        <button id="loginButton" type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  usernameLabel: PropTypes.string.isRequired,
  handleLogin: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm