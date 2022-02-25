const blogs = [
  {
    'title': 'Use cases considered harmful',
    'author': 'A.J.H Simons',
    'url': 'https://ieeexplore.ieee.org/document/779012',
    'likes': 33,
    'user': {
      'username': 'elsa.sarlin',
      'name': 'Elsa Sarlin',
      'id': '5dfcd5c77ff15f4c64a559ff'
    },
    'id': '5dfcdc966eb9595107010cbe'
  },
  {
    'title': 'Kela, Jumalasta seuraava',
    'author': 'Riku Sarlin',
    'url': 'https://sinetti.kela.fi/blogs/Kela_jumalasta_seuraava',
    'likes': 34,
    'user': {
      'username': 'elsa.sarlin',
      'name': 'Elsa Sarlin',
      'id': '5dfcd5c77ff15f4c64a559ff'
    },
    'id': '5dfcded7c311a752b5429d89'
  },
  {
    'title': 'Exploratory testing',
    'author': 'Martin Fowler',
    'url': 'https://martinfowler.com/bliki/ExploratoryTesting.html',
    'likes': 33,
    'user': {
      'username': 'elsa.sarlin',
      'name': 'Elsa Sarlin',
      'id': '5dfcd5c77ff15f4c64a559ff'
    },
    'id': '5dfcdedfc311a752b5429d8a'
  }
]

const getAll = () => {
  return Promise.resolve(blogs)
}

export default { getAll }