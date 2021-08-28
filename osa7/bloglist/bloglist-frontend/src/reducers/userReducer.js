import loginService from '../services/login'
import blogService from '../services/blogs'
import { notification } from './notificationReducer'

const userReducer = (state = null, action) => {
  switch(action.type){
  case('SET_USER'):
    return action.user
  case('REMOVE'):
    return null
  default:
    return state
  }
}

export const loginUser = (credentials) => {
  return async dispatch => {
    try{
      const result = await loginService.login(credentials)
      blogService.setToken(result.token)
      dispatch({ type:'SET_USER', user:result })
      await dispatch(notification('Logged in succesfully', 'confirmation'))
    }catch(exception){
      dispatch(notification('wrong credentials', 'error'))
    }
  }
}

export const setUser = (user) => {
  blogService.setToken(user.token)
  return { type: 'SET_USER', user }
}

export const removeUser = () => {
  blogService.setToken(null)
  return { type: 'REMOVE' }
}

export default userReducer