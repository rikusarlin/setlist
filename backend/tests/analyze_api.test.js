const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bandHelper = require('./bands_test_helper')
const testUtil = require('./test_utils')

var token

// Define console functions so that they exist...
global.console = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}

const introInput1 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [],
    },
  ],
  contents: '[Intro]',
}
const introOutput1 = {
  pages: [
    {
      pageNumber: 1,
      rows: [
        {
          rowNumber: 1,
          rowType: 'Label',
          contents: '[Intro]',
        },
      ],
    },
  ],
}

const introInput2 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [],
    },
  ],
  contents: '  begin with [Intro]',
}
const introOutput2 = {
  pages: [
    {
      pageNumber: 1,
      rows: [
        {
          rowNumber: 1,
          rowType: 'Label',
          contents: '  begin with [Intro]',
        },
      ],
    },
  ],
}

const skipWhiteSpaceInput1 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [],
    },
  ],
  contents: '[Intro]\n\nAm Fm',
  skipWhitespace: false,
}
const skipWhiteSpaceOutput1 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [
        {
          rowNumber: 1,
          rowType: 'Label',
          contents: '[Intro]',
        },
        {
          rowNumber: 2,
          rowType: 'Lyrics',
          contents: '',
        },
        {
          rowNumber: 3,
          rowType: 'Chords',
          contents: 'Am Fm',
        },
      ],
    },
  ],
}

const skipWhiteSpaceInput2 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [],
    },
  ],
  contents: '[Intro]\n\nAm Fm',
  skipWhitespace: true,
}
const skipWhiteSpaceOutput2 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [
        {
          rowNumber: 1,
          rowType: 'Label',
          contents: '[Intro]',
        },
        {
          rowNumber: 3,
          rowType: 'Chords',
          contents: 'Am Fm',
        },
      ],
    },
  ],
}

const skipWhiteSpaceInput3 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [],
    },
  ],
  contents: '[Intro]\n\nAm Fm'
}
const skipWhiteSpaceOutput3 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [
        {
          rowNumber: 1,
          rowType: 'Label',
          contents: '[Intro]',
        },
        {
          rowNumber: 2,
          rowType: 'Lyrics',
          contents: '',
        },
        {
          rowNumber: 3,
          rowType: 'Chords',
          contents: 'Am Fm',
        },
      ],
    },
  ],
}


const chordInput1 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [],
    },
  ],
  contents: 'C Em G',
}
const chordOutput1 = {
  pages: [
    {
      pageNumber: 1,
      rows: [
        {
          rowNumber: 1,
          rowType: 'Chords',
          contents: 'C Em G',
        },
      ],
    },
  ],
}

const chordInput2 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [],
    },
  ],
  contents: 'C Hm B',
}
const chordOutput2 = {
  pages: [
    {
      pageNumber: 1,
      rows: [
        {
          rowNumber: 1,
          rowType: 'Chords',
          contents: 'C Bm Bb',
        },
      ],
    },
  ],
}

const chordInput3 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [],
    },
  ],
  contents: 'C Bm Bb',
}
const chordOutput3 = {
  pages: [
    {
      pageNumber: 1,
      rows: [
        {
          rowNumber: 1,
          rowType: 'Chords',
          contents: 'C Bm Bb',
        },
      ],
    },
  ],
}

const songInput1 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [],
    },
  ],
  contents: '[Intro]\nC Bm Bb\n[Verse 1]\nC Bm Bb\nHey mama doing fine',
}
const songOutput1 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [
        {
          rowNumber: 1,
          rowType: 'Label',
          contents: '[Intro]',
        },
        {
          rowNumber: 2,
          rowType: 'Chords',
          contents: 'C Bm Bb',
        },
        {
          rowNumber: 3,
          rowType: 'Label',
          contents: '[Verse 1]',
        },
        {
          rowNumber: 4,
          rowType: 'Chords',
          contents: 'C Bm Bb',
        },
        {
          rowNumber: 5,
          rowType: 'Lyrics',
          contents: 'Hey mama doing fine',
        },
      ],
    },
  ],
}

beforeAll(async () => {
  var newBand = bandHelper.newBand
  newBand.username = testUtil.randomStr(16)
  await api.post('/api/bands').send(newBand)
  const res = await api.post('/api/login').send({
    username: newBand.username,
    password: bandHelper.newBand.password,
  })
  token = res.body.token
})

describe('single rows', () => {
  test('single rows row beginning with angle bracket is recognized as label', async (done) => {
    const response = await api
      .post('/api/analyze')
      .set('Authorization', `bearer ${token}`)
      .send(introInput1)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(
      introOutput1.pages[0].rows
    )
    done()
  })
  test('single rows row having an angle bracket is recognized as label', async (done) => {
    const response = await api
      .post('/api/analyze')
      .set('Authorization', `bearer ${token}`)
      .send(introInput2)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(
      introOutput2.pages[0].rows
    )
    done()
  })
  test('row with chrods is recognised as chords', async (done) => {
    const response = await api
      .post('/api/analyze')
      .set('Authorization', `bearer ${token}`)
      .send(chordInput1)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(
      chordOutput1.pages[0].rows
    )
    done()
  })
  test('row with German chrods is recognised as chords and translated into English notation', async (done) => {
    const response = await api
      .post('/api/analyze')
      .set('Authorization', `bearer ${token}`)
      .send(chordInput2)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(
      chordOutput2.pages[0].rows
    )
    done()
  })
  test('English chords remain English chords', async (done) => {
    const response = await api
      .post('/api/analyze')
      .set('Authorization', `bearer ${token}`)
      .send(chordInput3)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(
      chordOutput3.pages[0].rows
    )
    done()
  })
})

describe('song analysis', () => {
  test('5 row piece is correctly analyzed', async (done) => {
    const response = await api
      .post('/api/analyze')
      .set('Authorization', `bearer ${token}`)
      .send(songInput1)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(songOutput1.pages[0].rows)
    done()
  })
})

describe('whitespace tests', () => {
  test('whitespace remains if told so', async (done) => {
    const response = await api
      .post('/api/analyze')
      .set('Authorization', `bearer ${token}`)
      .send(skipWhiteSpaceInput1)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(skipWhiteSpaceOutput1.pages[0].rows)
    done()
  })
  test('whitespace is skipped if specified so', async (done) => {
    const response = await api
      .post('/api/analyze')
      .set('Authorization', `bearer ${token}`)
      .send(skipWhiteSpaceInput2)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(skipWhiteSpaceOutput2.pages[0].rows)
    done()
  })
  test('whitespace remains by default', async (done) => {
    const response = await api
      .post('/api/analyze')
      .set('Authorization', `bearer ${token}`)
      .send(skipWhiteSpaceInput3)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(skipWhiteSpaceOutput3.pages[0].rows)
    done()
  })
})

const instrumentNoteInput1 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [],
    },
  ],
  contents: '[Intro]\nC Bm Bb\n[Verse 1]',
  noteContents: '\nPlay really spaciously',
}
const instrumentNoteInput2 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [
    {
      pageNumber: 1,
      rows: [],
    },
  ],
  contents: '[Intro]\nC Bm Bb\n[Verse 1]',
  noteContents: '\nPlay really spaciously',
  noteInstrument: 'Guitar',
}
const instrumentNoteOutput2 = {
  title: 'title1',
  artist: 'artist1',
  duration: 120,
  delay: 30,
  pages: [{
    pageNumber: 1,
    rows: [
      {
        rowNumber: 1,
        rowType: 'Label',
        contents: '[Intro]',
      },
      {
        rowNumber: 2,
        rowType: 'Chords',
        contents: 'C Bm Bb',
      },
      {
        rowNumber: 3,
        rowType: 'Label',
        contents: '[Verse 1]',
      },
    ],
  }],
  notes: [{
    noteInstrument: 'Guitar',
    rows: [
      {
        rowNumber: 1,
        contents: '',
      },
      {
        rowNumber: 2,
        contents: 'Play really spaciously',
      },
    ],
  }],
}

describe('instrumeent note tests', () => {
  test('Instrument name is required if instrument notes are given', async (done) => {
    const response = await api
      .post('/api/analyze')
      .set('Authorization', `bearer ${token}`)
      .send(instrumentNoteInput1)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toContain('Note instrument is required if notes are given')
    done()
  })
  test('instrument notes are parsed correctly if given', async (done) => {
    const response = await api
      .post('/api/analyze')
      .set('Authorization', `bearer ${token}`)
      .send(instrumentNoteInput2)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.pages[0].rows).toStrictEqual(instrumentNoteOutput2.pages[0].rows)
    expect(response.body.notes[0].rows).toStrictEqual(instrumentNoteOutput2.notes[0].rows)
    done()
  })
})

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500))
})
