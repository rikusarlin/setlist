const analyzeRouter = require('express').Router()
const logger = require('../utils/logger')
const { chordTest } = require('../utils/music')

analyzeRouter.post('/', async (req, res, next) => {

  try {

    if(typeof req.body.contents === 'undefined'){
      return res.status(400).json({ error:'No contents to analyze' })
    }

    let contents = req.body.contents
    if(contents.indexOf('\n')===-1) {
      contents = contents + '\n'
    }
    let rows = []
    let rN = 1
    req.body.contents.split('\n').map(row => {
      // Analyze whether the row is lyrics, chords or label
      let rowType = 'Lyrics'
      if(row.indexOf('[') >= 0){
        rowType = 'Label'
      } else if(chordTest.test(`  ${row}  `)) {
        rowType = 'Chords'
      }
      rows.push({
        rowNumber: rN,
        rowType: rowType,
        contents: row
      })
      rN++
    })

    // Change possible german notation to english (H=>B, B => Bb)
    let isGerman = false
    for(let i=0; i<rows.length; i++){
      if(rows[i].rowType==='Chords'){
        if(rows[i].contents.indexOf('H')>=0){
          isGerman = true
          break
        }
      }
    }
    if(isGerman){
      for(let i=0; i<rows.length; i++){
        if(rows[i].rowType==='Chords'){
          rows[i].contents = rows[i].contents.replace('B', 'Bb')
          rows[i].contents = rows[i].contents.replace('H', 'B')
        }
      }
    }
    //logger.info('rows: '+JSON.stringify(rows))

    res.status(200).json(rows)
  } catch (error) {
    logger.error('error: '+error)
    next(error)
  }
})

module.exports = analyzeRouter