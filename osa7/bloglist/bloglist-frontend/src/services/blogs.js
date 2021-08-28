import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getUsers = () => {
  const request = axios.get('/api/users')
  return request.then(response => response.data)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (newObject, id) => {

  const updateUrl = `${baseUrl}/${id}`
  const response = await axios.put(updateUrl, newObject)
  return response.data
}

const deletion = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const deleteUrl = `${baseUrl}/${id}`
  const response = await axios.delete(deleteUrl, config)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setToken, create, update, deletion, getUsers }