const initialState = ""

const filterReducer = (state = initialState, action) => {
    switch(action.type){
        case'ADD':
        return action.content
        default:
            return state
    }
}

export const filterMaker = (contentTxt) => {
    return {type:'ADD', content:contentTxt}
}

export default filterReducer
