const logger = require('../utils/logger')

const majorChords = [
  'C ',
  'C# ',
  'D ',
  'D# ',
  'E ',
  'F ',
  'F# ',
  'G ',
  'G# ',
  'Bb ',
  'B ',
  'H ',
]
const major7Chords = [
  'C7 ',
  'C#7 ',
  'D7 ',
  'D#7 ',
  'E7 ',
  'F7 ',
  'F#7 ',
  'G7 ',
  'G#7 ',
  'A7 ',
  'Bb7 ',
  'B7 ',
  'H7 ',
]
const major6Chords = [
  'C6 ',
  'C#6 ',
  'D6 ',
  'D#6 ',
  'E6 ',
  'F6 ',
  'F#6 ',
  'G6 ',
  'G#6 ',
  'A6 ',
  'Bb6 ',
  'B6 ',
  'H6 ',
]
const majorAdd9Chords = [
  'Cadd9 ',
  'C#add9 ',
  'Dadd9 ',
  'D#add9 ',
  'Eadd9 ',
  'Fadd9 ',
  'F#add9 ',
  'Gadd9 ',
  'G#add9 ',
  'Aadd9 ',
  'Bbadd9 ',
  'Badd9 ',
  'Hadd9 ',
]
const major11Chords = [
  'C11 ',
  'C#11 ',
  'D11 ',
  'D#11 ',
  'E11 ',
  'F11 ',
  'F#11 ',
  'G11 ',
  'G#11 ',
  'A11 ',
  'Bb11 ',
  'B11 ',
  'H11 ',
]
const majorSus2Chords = [
  'Csus2 ',
  'C#sus2 ',
  'Dsus2 ',
  'D#sus2 ',
  'Esus2 ',
  'Fsus2 ',
  'F#sus2 ',
  'Gsus2 ',
  'G#sus2 ',
  'Bbsus2 ',
  'Bsus2 ',
  'Hsus2 ',
]
const majorSus4Chords = [
  'Csus4 ',
  'C#sus4 ',
  'Dsus4 ',
  'D#sus4 ',
  'Esus4 ',
  'Fsus4 ',
  'F#sus4 ',
  'Gsus4 ',
  'G#sus4 ',
  'Bbsus4 ',
  'Bsus4 ',
  'Hsus4 ',
]
const majormaj7Chords = [
  'Cmaj7 ',
  'C#maj7 ',
  'Dmaj7 ',
  'D#maj7 ',
  'Emaj7 ',
  'Fmaj7 ',
  'F#maj7 ',
  'Gmaj7 ',
  'G#maj7 ',
  'Amaj7 ',
  'Bbmaj7 ',
  'Bmaj7 ',
  'Hmaj7 ',
]
const minorChords = [
  'Cm ',
  'C#m ',
  'Dm ',
  'D#m ',
  'Em ',
  'Fm ',
  'F#m ',
  'Gm ',
  'G#m ',
  '  Am  ',
  'Bbm ',
  'Bm ',
]
const minor7Chords = [
  'Cm7 ',
  'C#m7 ',
  'Dm7 ',
  'D#m7 ',
  'Em7 ',
  'Fm7 ',
  'F#m7 ',
  'Gm7 ',
  'G#m7 ',
  'Am7 ',
  'Bbm7 ',
  'Bm7 ',
  'Hm7 ',
]
const minor6Chords = [
  'Cm6 ',
  'C#m6 ',
  'Dm6 ',
  'D#m6 ',
  'Em6 ',
  'Fm6 ',
  'F#m6 ',
  'Gm6 ',
  'G#m6 ',
  'Am6 ',
  'Bbm6 ',
  'Bm6 ',
  'Hm6 ',
]
const minorAdd9Chords = [
  'Cmadd9 ',
  'C#madd9 ',
  'Dmadd9 ',
  'D#madd9 ',
  'Emadd9 ',
  'Fmadd9 ',
  'F#madd9 ',
  'Gmadd9 ',
  'G#madd9 ',
  'Amadd9 ',
  'Bbmadd9 ',
  'Bmadd9 ',
  'Hmadd9 ',
]
const minor11Chords = [
  'Cm11 ',
  'C#m11 ',
  'Dm11 ',
  'D#m11 ',
  'Em11 ',
  'Fm11 ',
  'F#m11 ',
  'Gm11 ',
  'G#m11 ',
  'Am11 ',
  'Bbm11 ',
  'Bm11 ',
  'Hm11 ',
]
const minorSus2Chords = [
  'Cmsus2 ',
  'C#msus2 ',
  'Dmsus2 ',
  'D#msus2 ',
  'Emsus2 ',
  'Fmsus2 ',
  'F#msus2 ',
  'Gmsus2 ',
  'G#msus2 ',
  'Bbmsus2 ',
  'Bmsus2 ',
  'Hmsus2 ',
]
const minorSus4Chords = [
  'Cmsus4 ',
  'C#msus4 ',
  'Dmsus4 ',
  'D#msus4 ',
  'Emsus4 ',
  'Fmsus4 ',
  'F#msus4 ',
  'Gmsus4 ',
  'G#msus4 ',
  'Bbmsus4 ',
  'Bmsus4 ',
  'Hmsus4 ',
]
const minormaj7Chords = [
  'Cmmaj7 ',
  'C#mmaj7 ',
  'Dmmaj7 ',
  'D#mmaj7 ',
  'Emmaj7 ',
  'Fmmaj7 ',
  'F#mmaj7 ',
  'Gmmaj7 ',
  'G#mmaj7 ',
  'Ammaj7 ',
  'Bbmmaj7 ',
  'Bmmaj7 ',
  'Hmmaj7 ',
]
const chordTest = new RegExp(
  majorChords
    .concat(major7Chords)
    .concat(major6Chords)
    .concat(majorAdd9Chords)
    .concat(major11Chords)
    .concat(majorSus2Chords)
    .concat(majorSus4Chords)
    .concat(majormaj7Chords)
    .concat(minorChords)
    .concat(minor7Chords)
    .concat(minor6Chords)
    .concat(minorAdd9Chords)
    .concat(minor11Chords)
    .concat(minorSus2Chords)
    .concat(minorSus4Chords)
    .concat(minormaj7Chords)
    .join('|')
)

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B']

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
