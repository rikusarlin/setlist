import axios from 'axios'
const baseUrl = '/api/analyze'

const analyze= async (contents) => {
  const response = await axios.post(baseUrl, contents)
  return response.data
}

export default { analyze }
