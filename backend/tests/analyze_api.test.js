const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

// Define console functions so that they exist...
global.console = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn()
}

const introInput1 = {
  'title': 'title1',
  'artist': 'artist1',
  'bpm': 60,
  'pages': [
    {
      'pageNumber': 1,
      'rows': []
    }
  ],
  'contents': '[Intro]'
}
const introOutput1 = {
  'pages': [
    {
      'pageNumber': 1,
      'rows': [{
        'rowNumber': 1,
        'rowType': 'Label',
        'contents': '[Intro]'
      }]
    }
  ],
}

const introInput2 = {
  'title': 'title1',
  'artist': 'artist1',
  'bpm': 60,
  'pages': [
    {
      'pageNumber': 1,
      'rows': []
    }
  ],
  'contents': '  begin with [Intro]'
}
const introOutput2 = {
  'pages': [
    {
      'pageNumber': 1,
      'rows': [{
        'rowNumber': 1,
        'rowType': 'Label',
        'contents': '  begin with [Intro]'
      }]
    }
  ],
}

const chordInput1 = {
  'title': 'title1',
  'artist': 'artist1',
  'bpm': 60,
  'pages': [
    {
      'pageNumber': 1,
      'rows': []
    }
  ],
  'contents': 'C Em G'
}
const chordOutput1 = {
  'pages': [
    {
      'pageNumber': 1,
      'rows': [{
        'rowNumber': 1,
        'rowType': 'Chords',
        'contents': 'C Em G'
      }]
    }
  ],
}

const chordInput2 = {
  'title': 'title1',
  'artist': 'artist1',
  'bpm': 60,
  'pages': [
    {
      'pageNumber': 1,
      'rows': []
    }
  ],
  'contents': 'C Hm B'
}
const chordOutput2 = {
  'pages': [
    {
      'pageNumber': 1,
      'rows': [{
        'rowNumber': 1,
        'rowType': 'Chords',
        'contents': 'C Bm Bb'
      }]
    }
  ],
}

const chordInput3 = {
  'title': 'title1',
  'artist': 'artist1',
  'bpm': 60,
  'pages': [
    {
      'pageNumber': 1,
      'rows': []
    }
  ],
  'contents': 'C Bm Bb'
}
const chordOutput3 = {
  'pages': [
    {
      'pageNumber': 1,
      'rows': [{
        'rowNumber': 1,
        'rowType': 'Chords',
        'contents': 'C Bm Bb'
      }]
    }
  ],
}

const songInput1 = {
  'title': 'title1',
  'artist': 'artist1',
  'bpm': 60,
  'pages': [
    {
      'pageNumber': 1,
      'rows': []
    }
  ],
  'contents': '[Intro]\nC Bm Bb\n[Verse 1]\nC Bm Bb\nHey mama doing fine'
}
const songOutput1 = {
  'pages': [
    {
      'pageNumber': 1,
      'rows': [{
        'rowNumber': 1,
        'rowType': 'Label',
        'contents': '[Intro]'
      },
      {
        'rowNumber': 2,
        'rowType': 'Chords',
        'contents': 'C Bm Bb'
      },
      {
        'rowNumber': 3,
        'rowType': 'Label',
        'contents': '[Verse 1]'
      },
      {
        'rowNumber': 4,
        'rowType': 'Chords',
        'contents': 'C Bm Bb'
      },
      {
        'rowNumber': 5,
        'rowType': 'Lyrics',
        'contents': 'Hey mama doing fine'
      }]
    }
  ],
}

describe('single rows', () => {
  test('single rows row beginning with angle bracket is recognized as label', async (done) => {
    const response = await api.post('/api/analyze')
      .send(introInput1)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(introOutput1.pages[0].rows)
    done()
  })
  test('single rows row having an angle bracket is recognized as label', async (done) => {
    const response = await api.post('/api/analyze')
      .send(introInput2)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(introOutput2.pages[0].rows)
    done()
  })
  test('row with chrods is recognised as chords', async (done) => {
    const response = await api.post('/api/analyze')
      .send(chordInput1)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(chordOutput1.pages[0].rows)
    done()
  })
  test('row with German chrods is recognised as chords and translated into English notation', async (done) => {
    const response = await api.post('/api/analyze')
      .send(chordInput2)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(chordOutput2.pages[0].rows)
    done()
  })
  test('English chords remain English chords', async (done) => {
    const response = await api.post('/api/analyze')
      .send(chordInput3)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(chordOutput3.pages[0].rows)
    done()
  })
})

describe('song analysis', () => {
  test('5 row piece is correctly analyzed', async (done) => {
    const response = await api.post('/api/analyze')
      .send(songInput1)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(songOutput1.pages[0].rows)
    done()
  })
})

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500))
})