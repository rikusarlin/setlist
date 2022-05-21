const logger = require('../utils/logger')

const notes = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'Bb',
  'B',
  'H',
]
const notesNoA = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'Bb',
  'B',
  'H',
]
const modifiers = [
  '7',
  'maj7',
  '5',
  '6',
  '9',
  '11',
  '13',
  'add6',
  'add9',
  'add11',
  '7add6',
  '7add9',
  '7add11',
  'sus',
  'sus2',
  'sus4',
  'm7',
  'mMaj7',
  'm6',
  'm9',
  'm11',
  'm13',
  'madd6',
  'madd9',
  'madd11',
  'm7add6',
  'm7add9',
  'm7add11',
]

const chordList = () => {
  const chords = notesNoA
    .map((note) => note.concat(' '))
    .concat(notesNoA.map((note) => note.concat('m ')))
    .concat(
      modifiers
        .map((modifier) =>
          notes.map((note) => note.concat(modifier).concat(' '))
        )
        .reduce((prev, next) => prev.concat(next))
    )
    .concat('  A  ')
    .concat('  Am  ')
    .join('|')
  return chords
}

const chordTest = new RegExp(chordList())

// Thanks t-mart
// https://stackoverflow.com/questions/5173316/finding-the-word-at-a-position-in-javascript
const getWordBoundsAtPosition = (str, position) => {
  const isSpace = (c) => /\s/.exec(c)
  let start = position - 1
  let end = position
  while (start >= 0 && !isSpace(str[start])) {
    start -= 1
  }
  start = Math.max(0, start + 1)
  while (end < str.length && !isSpace(str[end])) {
    end += 1
  }
  end = Math.max(start, end)
  return [start, end]
}

// Thanks Forivin, just added down direction to this
// https://stackoverflow.com/questions/7936843/how-do-i-transpose-music-chords-using-javascript
const transposeChord = (chord, amount) => {
  var scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B']
  var normalizeMap = {
    Cb: 'B',
    Db: 'C#',
    Eb: 'D#',
    Fb: 'E',
    Gb: 'F#',
    Ab: 'G#',
    'A#': 'Bb',
    'E#': 'F',
    'B#': 'C',
  }
  return chord.replace(/[CDEFGAB](b|#)?/g, function (match) {
    const i =
      (scale.indexOf(normalizeMap[match] ? normalizeMap[match] : match) +
        amount) %
      scale.length
    return scale[i < 0 ? i + scale.length : i]
  })
}

const transpose = (chords, isUp) => {
  const direction = isUp ? 'up' : 'down'
  logger.info(`Chords to transpose: ${chords}, direction: ${direction}`)
  let transposedChords = ''
  // Transpose chords in a string, keeping the chords in the same position as before
  let chordStartPositions = []
  let newChords = []
  let currentStartPosition = -1
  // Chart position of chords and the new chords
  for (let pos = 0; pos < chords.length; pos++) {
    const [start, end] = getWordBoundsAtPosition(chords, pos)
    if (start !== currentStartPosition && start !== end) {
      currentStartPosition = start
      chordStartPositions.push(start)
      newChords.push(
        transposeChord(chords.substring(start, end), isUp ? 1 : -1)
      )
    }
  }
  logger.info(JSON.stringify(chordStartPositions))
  logger.info(JSON.stringify(newChords))
  // Form the new chord string based on this information, replacing the rest with spaces
  if (newChords.length > 0) {
    if (chordStartPositions[0] !== 0) {
      transposedChords = transposedChords.concat(
        ' '.repeat(chordStartPositions[0])
      )
      transposedChords = transposedChords.concat(newChords[0])
    } else {
      transposedChords = transposedChords.concat(newChords[0])
    }
    for (let nChord = 1; nChord < newChords.length; nChord++) {
      let nSpaces = chordStartPositions[nChord] - transposedChords.length
      if (nSpaces === 0) {
        transposedChords = transposedChords.concat(' ')
      } else {
        transposedChords = transposedChords.concat(
          ' '.repeat(nSpaces < 0 ? 0 : nSpaces)
        )
      }
      transposedChords = transposedChords.concat(newChords[nChord])
      if (nChord !== newChords.length - 1) {
        transposedChords = transposedChords.concat(' ')
      }
    }
  }
  logger.info(`Chords after transpose: ${transposedChords}`)
  return transposedChords
}

module.exports = {
  chordTest,
  notes,
  transpose,
  transposeChord,
  getWordBoundsAtPosition,
}
