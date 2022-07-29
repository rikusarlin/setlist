const BandSetlist = require('../models/bandsetlist')
//const { v4: uuidv4 } = require('uuid')

//const uuid1 = uuidv4()
//const uuid2 = uuidv4()

const initialPieces = [
  {
    //pk: `PIECE-${uuid1}`,
    //sk: 'PIECE',
    title: 'Knockin on Heavens Door',
    //id: uuid1,
    artist: 'Bob Dylan',
    duration: 150,
    delay: 35,
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
            contents: 'G D Am',
          },
        ],
      },
      {
        pageNumber: 2,
        rows: [
          {
            rowNumber: 1,
            rowType: 'Label',
            contents: '[Verse]',
          },
          {
            rowNumber: 2,
            rowType: 'Chords',
            contents: 'G           D           Am',
          },
          {
            rowNumber: 3,
            rowType: 'Lyrics',
            contents: 'Mama put my guns in the ground',
          },
        ],
      },
    ],
  },
  {
    //pk: `PIECE-${uuid2}`,
    //sk: 'PIECE',
    //id: uuid2,
    title: 'Here Comes The Sun',
    artist: 'Beatles',
    duration: 185,
    delay: 35,
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
            contents: 'D     D     G     A7',
          },
          {
            rowNumber: 3,
            rowType: 'Chords',
            contents: 'D     D     G     A7',
          },
        ],
      },
      {
        pageNumber: 2,
        rows: [
          {
            rowNumber: 4,
            rowType: 'Label',
            contents: '[Chorus]',
          },
          {
            rowNumber: 5,
            rowType: 'Chords',
            contents: 'D',
          },
          {
            rowNumber: 6,
            rowType: 'Lyrics',
            contents: ' Here comes the sun (doo doo doo doo)',
          },
        ],
      },
    ],
  },
]

var newPiece = {
  title: 'Simple Man',
  artist: 'Lynyrd Skynyrd',
  duration: 356,
  delay: 40,
  pages: [
    {
      pageNumber: 1,
      rows: [
        {
          rowNumber: 1,
          rowType: 'Label',
          contents: '[Verse 1]',
        },
        {
          rowNumber: 2,
          rowType: 'Chords',
          contents: '       C            G            Am',
        },
        {
          rowNumber: 3,
          rowType: 'Lyrics',
          contents: 'Well, Mama told me,  when I was young.',
        },
      ],
    },
    {
      pageNumber: 2,
      rows: [
        {
          rowNumber: 1,
          rowType: 'Label',
          contents: '[Verse 3]',
        },
        {
          rowNumber: 2,
          rowType: 'Chords',
          contents: '            C     G                Am',
        },
        {
          rowNumber: 3,
          rowType: 'Lyrics',
          contents: 'Forget your lust,  for rich mans gold,',
        },
      ],
    },
  ],
}

const piecesInDb = async () => {
  let pieces = await BandSetlist.query('sk').eq('PIECE').using('GSI1').exec()
  pieces.sort((a, b) => b.title.localeCompare(a.title))
  return pieces.map((b) => b.toJSON())
}

module.exports = {
  initialPieces,
  newPiece,
  piecesInDb,
}
