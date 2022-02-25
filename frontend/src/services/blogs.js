import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async (token) => {
  const config = {
    headers: { 'Authorization': `bearer ${token}` },
  }
  //console.log("blogs service, getAll(), config:",config)
  const response = await axios.get(baseUrl, config)
  //console.log("Response.data from getAll(): ",response.data)
  return response.data
}

const create = async (newBlog, token) => {
  const config = {
    headers: { 'Authorization': `bearer ${token}` },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (updatedBlog, token) => {
  const config = {
    headers: { 'Authorization': `bearer ${token}` },
  }
  const response = await axios.put(baseUrl+'/'+updatedBlog.id, updatedBlog, config)
  return response.data
}

const deleteBlog = async (id, token) => {
  const config = {
    headers: { 'Authorization': `bearer ${token}` },
  }
  const response = await axios.delete(baseUrl+'/'+id,config)
  return response.data
}

const comment = async (id, comment, token) => {
  const config = {
    headers: { 'Authorization': `bearer ${token}` },
  }
  const response = await axios.post(baseUrl+'/'+id+'/comments',comment,config)
  return response.data
}

export default { getAll, create, update, deleteBlog, comment }
