import blogService from '../services/blogs'

const userlistReducer = (state = [], action) => {
  switch(action.type){
  case('SET_LIST'):
    return action.userList
  default:
    return state
  }
}

export const setuserList = () => {
  return async dispatch => {
    const users = await blogService.getUsers()
    dispatch({
      type:'SET_LIST',
      userList: users
    })
  }
}

export default userlistReducer