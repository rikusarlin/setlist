const majorChords = ['C ', 'C# ', 'D ', 'D# ', 'E ', 'F ', 'F# ', 'G ', 'G# ', 'Bb ','B ','H ']
const major7Chords = ['C7 ', 'C#7 ', 'D7 ', 'D#7 ', 'E7 ', 'F7 ', 'F#7 ', 'G7 ', 'G#7 ', 'A7 ','Bb7 ','B7 ','H7 ']
const majormaj7Chords = ['Cmaj7 ', 'C#maj7 ', 'Dmaj7 ', 'D#maj7 ', 'Emaj7 ', 'Fmaj7 ', 'F#maj7 ', 'Gmaj7 ', 'G#maj7 ', 'Amaj7 ','Bbmaj7 ','Bmaj7 ','Hmaj7 ']
const minorChords = ['Cm ', 'C#m ', 'Dm ', 'D#m ', 'Em ', 'Fm ', 'F#m ', 'Gm ', 'G#m ','  Am  ', 'Bbm ','Bm ']
const minor7Chords = ['Cm7 ', 'C#m7 ', 'Dm7 ', 'D#m7 ', 'Em7 ', 'Fm7 ', 'F#m7 ', 'Gm7 ', 'G#m7 ', 'Am7 ','Bbm7 ','Bm7 ','Hm7 ']
const minormaj7Chords = ['Cmmaj7 ', 'C#mmaj7 ', 'Dmmaj7 ', 'D#mmaj7 ', 'Emmaj7 ', 'Fmmaj7 ', 'F#mmaj7 ', 'Gmmaj7 ', 'G#mmaj7 ', 'Ammaj7 ','Bbmmaj7 ','Bmmaj7 ','Hmmaj7 ']
const chordTest = new RegExp(
  majorChords
    .concat(major7Chords)
    .concat(major7Chords)
    .concat(majormaj7Chords)
    .concat(minorChords)
    .concat(minor7Chords)
    .concat(minormaj7Chords)
    .concat(minormaj7Chords)
    .join('|'))

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'Bb', 'B']

module.exports = {
  chordTest,
  notes
}
