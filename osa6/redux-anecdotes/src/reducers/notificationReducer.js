const initialState = null

const notificationReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SHOW_NOTE':
            return action.note
        case 'HIDE_NOTE':
            return null
        default:
            return state
    }
}

let timer; 

export const notification = (note, time) => {
    return function (dispatch) {
        dispatch(showNote(note))

        clearTimeout(timer)
        timer = setTimeout(() => {
            dispatch(hideNote())
        }, time*1000)
    }
}

const showNote = (note) => {
    return {type:'SHOW_NOTE', note:note}
}
const hideNote = () => {
    return {type:'HIDE_NOTE'}
}



export const likeNote = (note) => {
        
    return dispatch => {
        dispatch({
            type:'LIKE_NOTE',
            note:`You voted '${note}'`
        })
        setTimeout(() => {
            dispatch({
                type:'LIKE_NOTE',
                note: null
            }, 5000)
        })
    }

    /*
    if(note){
        return {type:'LIKE_NOTE', note:`You voted '${note}'`}
    }else{
        return {type:'LIKE_NOTE', note:null}
    }
    */
}
export const createNote = (note) => {
    if(note){
        return {type:'CREATE_NOTE', note:`You created '${note}'`}
    }else{
        return {type:'CREATE_NOTE', note:null}
    }
}

export default notificationReducer