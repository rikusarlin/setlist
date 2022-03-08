import axios from 'axios'
const baseUrl = '/api/analyze'

const analyze= async (piece, token) => {
  const config = {
    headers: { 'Authorization': `bearer ${token}` },
  }
  const response = await axios.post(baseUrl, piece, config)
  return response.data
}

export default { analyze }
