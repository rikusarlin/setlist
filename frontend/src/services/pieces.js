import axios from 'axios'
const baseUrl = '/api/pieces'

const getAll = async (token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const getPiece = async (id, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }
  const response = await axios.get(baseUrl + '/' + id, config)
  return response.data
}

const create = async (newPiece, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }
  const response = await axios.post(baseUrl, newPiece, config)
  return response.data
}

const update = async (updatedPiece, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }
  const response = await axios.put(
    baseUrl + '/' + updatedPiece.id,
    updatedPiece,
    config
  )
  return response.data
}

const transpose = async (piece, direction, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }
  const response = await axios.put(
    baseUrl + '/' + piece.id + '/transpose/' + direction,
    piece,
    config
  )
  return response.data
}

const deletePiece = async (id, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  }
  const response = await axios.delete(baseUrl + '/' + id, config)
  return response.data
}

export default { getAll, create, update, deletePiece, getPiece, transpose }
