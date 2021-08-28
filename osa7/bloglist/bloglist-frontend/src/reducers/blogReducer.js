import blogService from '../services/blogs'
import { notification } from './notificationReducer'

const blogReducer = (state = [], action) => {
  switch(action.type){
  case('INIT_BLOGS'):
    return action.blogList
  default:
    return state
  }
}

export const initBlogs = (blogList) => {
  return { type: 'INIT_BLOGS', blogList }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type:'INIT_BLOGS',
      blogList: blogs
    })
  }
}

export const createAction = (blogObject, user, blogs) => {
  return async dispatch => {
    try{
      blogObject.user = user.id
      const result = await blogService.create(blogObject)
      const blogList = blogs.concat(result)
      dispatch({ type:'INIT_BLOGS', blogList })
      dispatch(notification('New entry added!', 'confirmation'))
    }catch(exception){
      dispatch(notification('Unable to create a new entry, be sure to fill all fields', 'error'))
    }
  }
}

export const updateAction = (blogObject, id, blogs) => {
  return async dispatch => {
    try{
      const result = await blogService.update(blogObject, id)
      const blogList = blogs.map(blog => {
        if (blog.id === result.id) {
          return result
        }else{
          return blog
        }
      })
      dispatch({ type: 'INIT_BLOGS', blogList })
      dispatch(notification('Like registered!', 'confirmation'))
    }catch(exception){
      dispatch(notification('could not update blog information', 'error'))
    }
  }
}

export const deleteAction = (blogObject, blogs) => {
  return async dispatch => {
    try{
      await blogService.deletion(blogObject.id)
      const blogList = blogs.filter(blog => blog.id!==blogObject.id)
      dispatch({ type: 'INIT_BLOGS', blogList })
      dispatch(notification('Blog entry removed!', 'confirmation'))
    }catch(exception){
      dispatch(notification('Could not delete blog', 'error'))
    }
  }
}



export default blogReducer