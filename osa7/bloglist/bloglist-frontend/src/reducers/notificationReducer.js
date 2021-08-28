const initialState = null

const notificationReducer = (state = initialState, action) => {
  switch(action.type){
  case 'SHOW_NOTE':
    return { message: action.note, style: action.style }
  case 'HIDE_NOTE':
    return null
  default:
    return state
  }
}

let timer

export const notification = (note, style) => {
  return function (dispatch) {
    dispatch(showNote(note, style))

    clearTimeout(timer)
    timer = setTimeout(() => {
      dispatch(hideNote())
    }, 5000)
  }
}

const showNote = (note, style) => {
  return { type:'SHOW_NOTE', note:note, style:style }
}
const hideNote = () => {
  return { type:'HIDE_NOTE' }
}

export default notificationReducer