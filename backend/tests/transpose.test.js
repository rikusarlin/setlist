const music = require('../utils/music')

describe('Transposing algorithm tests', () => {
  test('C is correctely transposed up as C#', async () => {
    expect(music.transposeChord('C', 1)).toBe('C#')
  })
  test('Am is correctely transposed down as G#m', async () => {
    expect(music.transposeChord('Am', -1)).toBe('G#m')
  })
  test('Dm7 is correctely transposed down as C#m7', async () => {
    expect(music.transposeChord('Dm7', -1)).toBe('C#m7')
  })
  test('Cmaj7 is correctely transposed down as Bmaj7', async () => {
    expect(music.transposeChord('Cmaj7', -1)).toBe('Bmaj7')
  })
  test('Bmmaj7 is correctely transposed down as Bbmmaj7', async () => {
    expect(music.transposeChord('Bmmaj7', -1)).toBe('Bbmmaj7')
  })
  test('Bbm7 is correctely transposed up as Bm7', async () => {
    expect(music.transposeChord('Bbm7', 1)).toBe('Bm7')
  })
})

describe('Word bound algorithm test', () => {
  test('Hello World wordPos(0) returns [0,5]', async () => {
    const [start, end] = music.getWordBoundsAtPosition('Hello World', 0)
    expect(start).toBe(0)
    expect(end).toBe(5)
  })
  test('Hello World wordPos(5) returns [0,5]', async () => {
    const [start, end] = music.getWordBoundsAtPosition('Hello World', 5)
    expect(start).toBe(0)
    expect(end).toBe(5)
  })
  test('Hello World wordPos(6) returns [6,11]', async () => {
    const [start, end] = music.getWordBoundsAtPosition('Hello World', 6)
    expect(start).toBe(6)
    expect(end).toBe(11)
  })

  const testString = 'C    Am'
  test('C    Am wordPos(0) returns [0,1]', async () => {
    const [start, end] = music.getWordBoundsAtPosition(testString, 0)
    expect(start).toBe(0)
    expect(end).toBe(1)
    expect(testString.substring(start, end)).toBe('C')
  })
  test('C    Am wordPos(1) returns [0,1]', async () => {
    const [start, end] = music.getWordBoundsAtPosition(testString, 1)
    expect(start).toBe(0)
    expect(end).toBe(1)
    expect(testString.substring(start, end)).toBe('C')
  })
  test('C    Am wordPos(2) returns [2,2]', async () => {
    const [start, end] = music.getWordBoundsAtPosition(testString, 2)
    expect(start).toBe(2)
    expect(end).toBe(2)
    expect(testString.substring(start, end)).toBe('')
  })
  test('C    Am wordPos(3) returns [3,3]', async () => {
    const [start, end] = music.getWordBoundsAtPosition(testString, 3)
    expect(start).toBe(3)
    expect(end).toBe(3)
    expect(testString.substring(start, end)).toBe('')
  })
  test('C    Am wordPos(4) returns [4,4]', async () => {
    const [start, end] = music.getWordBoundsAtPosition(testString, 4)
    expect(start).toBe(4)
    expect(end).toBe(4)
    expect(testString.substring(start, end)).toBe('')
  })
  test('C    Am wordPos(5) returns [5,7]', async () => {
    const [start, end] = music.getWordBoundsAtPosition(testString, 5)
    expect(start).toBe(5)
    expect(end).toBe(7)
    expect(testString.substring(start, end)).toBe('Am')
  })
  test('C    Am wordPos(6) returns [5,7]', async () => {
    const [start, end] = music.getWordBoundsAtPosition(testString, 6)
    expect(start).toBe(5)
    expect(end).toBe(7)
    expect(testString.substring(start, end)).toBe('Am')
  })
  test('C    Am wordPos(7) returns [5,7]', async () => {
    const [start, end] = music.getWordBoundsAtPosition(testString, 7)
    expect(start).toBe(5)
    expect(end).toBe(7)
    expect(testString.substring(start, end)).toBe('Am')
  })
})

describe('Chords string transposing test', () => {
  const testString1 = 'C Am'
  test('C Am is correctly transposed up as C# Bbm', async () => {
    const transposedString = music.transpose(testString1, true)
    expect(transposedString).toBe('C# Bbm')
  })
  test('C Am is correctly transposed down as B G#m', async () => {
    const transposedString = music.transpose(testString1, false)
    expect(transposedString).toBe('B G#m')
  })
  const testString2 = 'C# A#m'
  test('C# A#m is correctly transposed up as D  Bm', async () => {
    const transposedString = music.transpose(testString2, true)
    expect(transposedString).toBe('D  Bm')
  })
  test('C# A#m is correctly transposed down as C  Am', async () => {
    const transposedString = music.transpose(testString2, false)
    expect(transposedString).toBe('C  Am')
  })
  const testString3 = ' C# A#m'
  test(' C# A#m is correctly transposed up as  D  Bm - one space in front', async () => {
    const transposedString = music.transpose(testString3, true)
    expect(transposedString).toBe(' D  Bm')
  })
  const testString4 = ' B Gmmaj7   D7 '
  test(' B Gmmaj7   D7 is correctly transposed up as  C  G#mmaj7  D#7 - one space in front, none at end', async () => {
    const transposedString = music.transpose(testString4, true)
    expect(transposedString).toBe(' C G#mmaj7  D#7')
  })
  const testString5 = 'B E'
  const testString5UpResult = 'C F'
  test(`${testString5} is correctly transposed up as ${testString5UpResult} and back again`, async () => {
    const transposedString = music.transpose(testString5, true)
    expect(transposedString).toBe(testString5UpResult)
    const transposedString2 = music.transpose(transposedString, false)
    expect(transposedString2).toBe(testString5)
  })

  const testString6 = 'B A B'
  const testString6UpResult = 'C Bb C'
  const testString6DownResult = 'B A  B'
  test(`${testString6} is correctly transposed up as ${testString6UpResult} and back again`, async () => {
    const transposedString = music.transpose(testString6, true)
    expect(transposedString).toBe(testString6UpResult)
    const transposedString2 = music.transpose(transposedString, false)
    expect(transposedString2).toBe(testString6DownResult)
  })

  const testString7 = 'E C#m A B'
  const testString7UpResult = 'F Dm  Bb C'
  const testString7DownResult = 'E C#m  A  B'
  test(`${testString7} is correctly transposed up as ${testString7UpResult} and back again`, async () => {
    const transposedString = music.transpose(testString7, true)
    expect(transposedString).toBe(testString7UpResult)
    const transposedString2 = music.transpose(transposedString, false)
    expect(transposedString2).toBe(testString7DownResult)
  })
})
