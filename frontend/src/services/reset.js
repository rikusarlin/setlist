import axios from 'axios'
const baseUrl = '/api/reset'

const reset = async (resetInfo) => {
  const response = await axios.post(baseUrl, resetInfo)
  return response.data
}

export default { reset }
