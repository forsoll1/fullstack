import anecdoteService from '../services/anecdotes'
/*
const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const initialState = anecdotesAtStart.map(asObject)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const getId = () => (100000 * Math.random()).toFixed(0)
*/



const returnSorted = (anecdoteArray) => {
  if(anecdoteArray){
    const sortedState = anecdoteArray.sort( (a,b) => b.votes - a.votes)
    return sortedState
  }else {
    return anecdoteArray
  }
}

const anecdoteReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type) {
    case 'VOTE':
      const newState = state.map(anecdote => anecdote.id!==action.content.id ? anecdote : action.content)
      return returnSorted(newState)
    
    case 'NEW_ANECDOTE':
      const newAnecdoteList = [...state, action.content]
      return returnSorted(newAnecdoteList)
    
    case 'INIT_ANECDOTES':
      return returnSorted(action.content)
    
    default:
      return returnSorted(state)
  }
}

export const anecdoteMaker = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    dispatch({
      type: 'NEW_ANECDOTE',
      content: newAnecdote
    })
  }
}

export const voteMaker = (anecdoteObj) => {
    return async dispatch => {
      const votedAnecdote = await anecdoteService.updateAnecdote(anecdoteObj)
      console.log(votedAnecdote)
      dispatch({
        type: 'VOTE',
        content:votedAnecdote
      })
    }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      content: anecdotes
    })
  }
}

export default anecdoteReducer