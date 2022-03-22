import axios from 'axios'
const baseUrl = '/api/setlist'

const getSetlists = async (token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const createSetlist = async (name, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }
  const newSetlist = {
    name: name,
  }
  const response = await axios.post(baseUrl, newSetlist, config)
  return response.data
}

const addPieceToSetlist = async (setlistId, pieceId, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }
  const response = await axios.put(`${baseUrl}/${setlistId}/${pieceId}`, config)
  return response.data
}

const deletePieceFromSetlist = async (setlistId, pieceId, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }
  const response = await axios.put(`${baseUrl}/${setlistId}/${pieceId}`, config)
  return response.data
}

const movePieceInSetlist = async (setlistId, pieceId, direction, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }
  const response = await axios.put(
    `${baseUrl}/${setlistId}/${pieceId}/${direction}`,
    config
  )
  return response.data
}

export default {
  getSetlists,
  createSetlist,
  addPieceToSetlist,
  deletePieceFromSetlist,
  movePieceInSetlist,
}
