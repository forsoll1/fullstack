import React from 'react'
import { anecdoteMaker } from '../reducers/anecdoteReducer'
import { notification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

const AnecdoteForm = ( props ) => {

    const newAnecdote = async (event) => {
        event.preventDefault()
        const anecdote = event.target.anecdoteInput.value
        props.anecdoteMaker(anecdote)
        props.notification(`You added: "${anecdote}"`, 5)
        event.target.anecdoteInput.value = ""
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={newAnecdote}>
                <div><input name="anecdoteInput"/></div>
                <button type="submit">create</button>
            </form>
        </div>
  )
}
const mapDispatchToProps = {
    anecdoteMaker,
    notification
}

const ConnectedAnecdoteForm = connect(null,mapDispatchToProps)(AnecdoteForm)

export default ConnectedAnecdoteForm