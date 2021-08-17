import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (anecdote) => {
    const anecdoteObj = {
        content: anecdote, 
        votes: 0
    }
    const response = await axios.post(baseUrl, anecdoteObj)
    return response.data
}

const updateAnecdote = async (anecdoteObj) => {
    const updateUrl = `${baseUrl}/${anecdoteObj.id}`
    const newVotes = anecdoteObj.votes +1
    const newValues = {
        content: anecdoteObj.content,
        id: anecdoteObj.id,
        votes: newVotes
    }
    const response = await axios.put(updateUrl, newValues)
    return response.data
}

export default { getAll, createNew, updateAnecdote }