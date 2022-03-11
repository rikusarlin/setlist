const Piece = require('../models/piece')

const initialPieces = [
  {
    title: 'Knockin on Heavens Door',
    artist: 'Bob Dylan',
    bpm: 80,
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
    title: 'Here Comes The Sun',
    artist: 'Beatles',
    bpm: 70,
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
  bpm: 60,
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
  const pieces = await Piece.find({})
  return pieces.map((piece) => piece.toJSON())
}

module.exports = {
  initialPieces,
  newPiece,
  piecesInDb,
}
