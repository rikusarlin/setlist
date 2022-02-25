const user = {
  username: 'tester',
  token: '1231231214',
  name: 'Donald Tester'
}

const login = (credentials) => {
  console.log('credentials: ',credentials)
  return Promise.resolve(user)
}

export default { login }