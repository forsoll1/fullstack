import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteMaker } from '../reducers/anecdoteReducer'
import Notification from './Notification'
import { notification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {

    const dispatch = useDispatch()
    const anecdotes = useSelector(state => {
        if(state.filter.length>0){
            return state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
        }else{
            return state.anecdotes
        }
    })

    const vote = async (anecdote, content) => {
        dispatch(voteMaker(anecdote))
        dispatch(notification(`You voted for: "${content}"`, 5))
    }

    return(
        <div>
        <Notification />
        {anecdotes.map(anecdote =>
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes} votes
                <button onClick={() => vote(anecdote, anecdote.content)}>vote</button>
              </div>
            </div>
          )}
        </div>
    )
}

export default AnecdoteList