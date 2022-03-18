import axios from 'axios'
const baseUrl = '/api/bands'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const signUp = async (newBand) => {
  const response = await axios.post(baseUrl, newBand)
  return response.data
}

export default { getAll, signUp }
