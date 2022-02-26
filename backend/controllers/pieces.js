const piecesRouter = require('express').Router()
const Piece = require('../models/piece')
const Page = require('../models/page')
const Row = require('../models/row')
const Setlist = require('../models/setlist')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

piecesRouter.get('/', async (request, response, next) => {
  try {
    const pieces = await Piece.find({})
    logger.info('In piecesRouter.getAll, results:', pieces)
    response.json(pieces)
  } catch (error) {
    next(error)
  }
})

piecesRouter.post('/', async (req, res, next) => {

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    if(typeof req.body.title === 'undefined'){
      return res.status(400).json({ error:'Title of piece is required' })
    }
    if(typeof req.body.artist === 'undefined'){
      return res.status(400).json({ error:'Artist of piece is required' })
    }

    let piece = {
      title: req.body.title,
      artist: req.body.artist,
      bpm: req.body.bpm,
    }
    if(typeof req.body.bpm === 'undefined'){
      piece.bpm = 0
    }
    let pages = req.body.pages

    let newPiece = new Piece(piece)

    let savedPiece = await newPiece.save()
    //logger.info('savedPiece: '+JSON.stringify(savedPiece.toJSON()))
    insertNewPagesAndRows(savedPiece, pages)
    //logger.info('savedPiece after insertPagesAndRows: '+JSON.stringify(savedPiece.toJSON()))
    const savedPiece2 =  await Piece.findById(savedPiece._id)
      .populate({
        path: 'pages',
        populate: { path: 'rows' }
      })
    //logger.info('savedPiece2: '+JSON.stringify(savedPiece2.toJSON()))
    res.status(201).json(savedPiece2.toJSON())
  } catch (error) {
    logger.error('error: '+error)
    next(error)
  }
})

piecesRouter.get('/:id', async (req, res, next) => {
  try {
    const piece = await Piece.findById(req.params.id)
      .populate({
        path: 'pages',
        populate: { path: 'rows' }
      })

    if(piece){
      res.json(piece.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

piecesRouter.delete('/:id', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    const tokenUser = await User.findById(decodedToken.id)
    logger.info('tokenUser: ',tokenUser)
    logger.info('id: ',req.params.id)
    const pieceToDelete =  await Piece.findById(req.params.id)
      .populate({
        path: 'pages'
      })
    logger.info('pieceToDelete: ',pieceToDelete)

    if( !pieceToDelete){
      return res.status(204).end()
    }

    // Delete piece from setlists, if any
    const setlistsWithPiece = await Setlist.find({ 'pieces': { _id: req.params.id } } )
    for(let setlist=0; setlist<setlistsWithPiece.length; setlist++){
      var pieceIndex = setlist.pieces.indexOf(req.params.id)
      setlist.pieces.splice(pieceIndex, 1)
      setlist.save()
    }
    deletePagesAndRows(pieceToDelete)
    await Piece.findByIdAndRemove(pieceToDelete._id).setOptions({ 'useFindAndModify':false })
  } catch(error) {
    next(error)
  }
})

const deletePagesAndRows = async (piece) => {
  for(let page=0; page<piece.pages.length; page++){
    await Row.deleteMany({ page: piece.pages[page]._id })
  }
  await Page.deleteMany({ piece: piece._id })
  piece.pages = []
  await piece.save()
}

const insertNewPagesAndRows = async (piece, pages) => {
  logger.info('Pages to insert: '+pages.length+', piece id: '+piece._id)
  for(let page=0; page<pages.length; page++){
    let pageInfo = {
      title: pages[page].title,
      pageNumber: pages[page].pageNumber,
      piece: piece._id
    }
    let newPage = new Page(pageInfo)
    let savedPage = await newPage.save()
    logger.info('# of Rows to insert to page '+(page+1)+': '+pages[page].rows.length+', page id: '+savedPage._id)
    //logger.info('Rows to insert: '+JSON.stringify(pages[page].rows))
    for(let row=0; row<pages[page].rows.length; row++){
      //logger.info('Page: '+page+', row: '+row)
      //logger.info('Row: '+JSON.stringify(pages[page].rows[row]))
      let rowInfo = {
        rowNumber: pages[page].rows[row].rowNumber,
        rowType: pages[page].rows[row].rowType,
        contents: pages[page].rows[row].contents,
        page: savedPage._id
      }
      let newRow = new Row(rowInfo)
      //logger.info('newRow: '+JSON.stringify(newRow.toJSON()))
      const savedRow = await newRow.save()
      //logger.info('savedRow: '+JSON.stringify(savedRow.toJSON()))
      savedPage.rows.push(savedRow)
    }
    const savedPage2 = await savedPage.save()
    piece.pages.push(savedPage2)
  }
  await piece.save()
}

piecesRouter.put('/:id', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'Token missing or invalid' })
    }

    if(typeof req.body.title === 'undefined'){
      return res.status(400).json({ error:'Title of piece is required' })
    }
    if(typeof req.body.artist === 'undefined'){
      return res.status(400).json({ error:'Artist of piece is required' })
    }
    let piece = {
      id: req.params.id,
      title: req.body.title,
      artist: req.body.artist,
      bpm: req.body.bpm,
      pages: []
    }
    if(typeof req.body.bpm === 'undefined'){
      piece.bpm = 0
    }
    let pages = req.body.pages

    // Pages and rows are not updated, we just delete the previous ones and insert new ones
    let previousPiece =  await Piece.findById(req.params.id)
      .populate({
        path: 'pages'
      })
    deletePagesAndRows(previousPiece)

    //let updatedPiece = await Piece.findByIdAndUpdate(req.params.id, piece,
    //  { new: true, runValidators: false, context: 'query', useFindAndModify:false })
    previousPiece.overwrite(piece)
    let updatedPiece = await previousPiece.save()
    insertNewPagesAndRows(updatedPiece, pages)
    const updatedPiece2 =  await Piece.findById(req.params.id)
      .populate({
        path: 'pages',
        populate: { path: 'rows' }
      })
    if(updatedPiece){
      res.json(updatedPiece2.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})


module.exports = piecesRouter
