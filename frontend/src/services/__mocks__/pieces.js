const pieces = [
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
const getAll = () => {
  return Promise.resolve(pieces)
}

export default { getAll }
