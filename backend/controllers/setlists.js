const setlistRouter = require('express').Router()
const BandSetlist = require('../models/bandsetlist')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const { v4: uuidv4 } = require('uuid')
//const { update } = require('lodash')

setlistRouter.get('/', async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.username) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const setlists = await BandSetlist.query('sk')
      .eq('SETLIST')
      .where('data')
      .beginsWith(`BAND-${decodedToken.username}`)
      .attributes(['id', 'setlistName'])
      .using('GSI1')
      .exec()

    console.log(`setlists: ${JSON.stringify(setlists)}`)
    response.json(setlists)
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

setlistRouter.get('/:id', async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.username) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const setlist = await BandSetlist.get({
      pk: `SETLIST-${request.params.id}`,
      sk: 'SETLIST',
    })
    if (!setlist) {
      return response.status(404).json({ error: `setlist not found` })
    }
    console.log(JSON.stringify(setlist))
    const setlistPieces = await BandSetlist.query('pk')
      .eq(`SETLIST-${request.params.id}`)
      .where('sk')
      .beginsWith(`PIECE-`)
      .attributes([
        'id',
        'pk',
        'sk',
        'data',
        'setlistName',
        'title',
        'artist',
        'indexInSetlist',
      ])
      .exec()
    console.log('setlistPieces: ' + JSON.stringify(setlistPieces))
    let pieceData = setlistPieces.map((setlistPiece) => {
      return {
        id: setlistPiece.sk.substring(6),
        title: setlistPiece.title,
        artist: setlistPiece.artist,
        indexInSetlist: setlistPiece.indexInSetlist,
      }
    })
    pieceData.sort((a, b) => a.indexInSetlist - b.indexInSetlist)
    console.log(`pieceData: ${JSON.stringify(pieceData)}`)
    const setlistInfo = {
      id: request.params.id,
      name: setlist.setlistName,
    }
    if (pieceData) {
      setlistInfo.pieces = pieceData
    }
    console.log(`setlistInfo: ${JSON.stringify(setlistInfo)}`)
    response.json(setlistInfo)
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

setlistRouter.post('/', async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.username) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const body = request.body
    if (typeof body.name === 'undefined') {
      return response.status(400).json({ error: '`name` is required' })
    }
    if (body.name.length < 3) {
      return response.status(400).json({
        error: `name length ${body.name.length} is shorter than the minimum allowed length (3)`,
      })
    }
    const id = uuidv4()
    const setlist = {
      pk: `SETLIST-${id}`,
      sk: 'SETLIST',
      data: `BAND-${decodedToken.username}`,
      id: id,
      setlistName: body.name,
    }
    const newSetlist = new BandSetlist(setlist)
    const savedSetlist = await newSetlist.save()
    const setlist2 = {
      pk: `SETLIST-${id}`,
      sk: `BAND-${decodedToken.username}`,
      data: `SETLIST-${id}`,
      id: id,
      setlistName: body.name,
    }
    const newSetlist2 = new BandSetlist(setlist2)
    newSetlist2.save()
    response.status(201).json(savedSetlist)
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

setlistRouter.put('/:setlistid/:pieceid', async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.username) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const piece = await BandSetlist.get({
      pk: `PIECE-${request.params.pieceid}`,
      sk: 'PIECE',
    })
    if (!piece) {
      return response.status(404).json({ error: `piece not found` })
    }

    const setlist = await BandSetlist.get({
      pk: `SETLIST-${request.params.setlistid}`,
      sk: 'SETLIST',
    })
    if (!setlist) {
      return response.status(404).json({ error: `setlist not found` })
    }

    const pieceInsetlist = await BandSetlist.get({
      pk: `SETLIST-${request.params.setlistid}`,
      sk: `PIECE-${request.params.pieceid}`,
    })
    if (pieceInsetlist) {
      return response.status(400).json({
        error: `piece is already in setlist`,
      })
    }

    if (!setlist.pieces) {
      setlist.pieces = []
    }
    let piecesInSetlist = await BandSetlist.query('pk')
      .eq(`SETLIST-${request.params.setlistid}`)
      .where('sk')
      .beginsWith(`PIECE-`)
      .attributes([
        'id',
        'sk',
        'data',
        'setlistName',
        'title',
        'artist',
        'indexInSetlist',
      ])
      .exec()

    const newSetlistPieceData = {
      pk: `SETLIST-${request.params.setlistid}`,
      sk: `PIECE-${request.params.pieceid}`,
      data: `SETLIST-${request.params.setlistid}`,
      setlistName: setlist.name,
      indexInSetlist: piecesInSetlist.length,
      title: piece.title,
      artist: piece.artist,
    }
    const newSetlistPiece = new BandSetlist(newSetlistPieceData)
    const savedSetlistPiece = await newSetlistPiece.save()
    piecesInSetlist.push(savedSetlistPiece)
    piecesInSetlist.sort((a, b) => a.indexInSetlist - b.indexInSetlist)
    const pieceData = piecesInSetlist.map((setlistPiece) => {
      return {
        id: setlistPiece.sk.substring(6),
        title: setlistPiece.title,
        artist: setlistPiece.artist,
        indexInSetlist: setlistPiece.indexInSetlist,
      }
    })
    const setlistData = {
      id: setlist.id,
      name: setlist.setlistName,
      pieces: pieceData,
    }

    return response.status(200).json(setlistData)
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

setlistRouter.put(
  '/:setlistid/:pieceid/:dir',
  async (request, response, next) => {
    try {
      if (!request.token) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      if (!decodedToken.username) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }

      const piece = await BandSetlist.get({
        pk: `PIECE-${request.params.pieceid}`,
        sk: 'PIECE',
      })
      if (!piece) {
        return response.status(404).json({ error: `piece not found` })
      }

      const setlist = await BandSetlist.get({
        pk: `SETLIST-${request.params.setlistid}`,
        sk: 'SETLIST',
      })
      if (!setlist) {
        return response.status(404).json({ error: `setlist not found` })
      }

      let piecesInSetlist = await BandSetlist.query('pk')
        .eq(`SETLIST-${request.params.setlistid}`)
        .where('sk')
        .beginsWith(`PIECE-`)
        .attributes([
          'id',
          'pk',
          'sk',
          'data',
          'setlistName',
          'title',
          'artist',
          'indexInSetlist',
        ])
        .exec()

      let [setlistPiece] = piecesInSetlist.filter(
        (setlistPiece) => setlistPiece.sk === `PIECE-${piece.id}`
      )
      if (!setlistPiece) {
        return response.status(404).json({
          error: `piece not in setlist`,
        })
      }
      const pieceIndex = setlistPiece.indexInSetlist

      if (request.params.dir == 'up') {
        if (pieceIndex > 0) {
          let [pieceAbove] = piecesInSetlist.filter(
            (setlistPiece) => setlistPiece.indexInSetlist === pieceIndex - 1
          )
          setlistPiece.indexInSetlist = setlistPiece.indexInSetlist - 1
          pieceAbove.indexInSetlist = pieceAbove.indexInSetlist + 1
          await setlistPiece.save()
          await pieceAbove.save()
        }
      } else if (request.params.dir == 'down') {
        if (pieceIndex < piecesInSetlist.length - 1) {
          let [pieceBelow] = piecesInSetlist.filter(
            (setlistPiece) => setlistPiece.indexInSetlist === pieceIndex + 1
          )
          setlistPiece.indexInSetlist = setlistPiece.indexInSetlist + 1
          pieceBelow.indexInSetlist = pieceBelow.indexInSetlist - 1
          await setlistPiece.save()
          await pieceBelow.save()
        }
      } else {
        return response.status(400).json({
          error: `invalid direction, only up and down are allowed`,
        })
      }
      const updatedSetlist = await BandSetlist.query('pk')
        .eq(`SETLIST-${request.params.setlistid}`)
        .where('sk')
        .beginsWith(`PIECE-`)
        .attributes([
          'id',
          'pk',
          'sk',
          'data',
          'setlistName',
          'title',
          'artist',
          'indexInSetlist',
        ])
        .exec()
      let pieceData = updatedSetlist.map((setlistPiece) => {
        return {
          id: setlistPiece.sk.substring(6),
          title: setlistPiece.title,
          artist: setlistPiece.artist,
          indexInSetlist: setlistPiece.indexInSetlist,
        }
      })
      pieceData.sort((a, b) => a.indexInSetlist - b.indexInSetlist)
      const updatedSetlistData = {
        id: setlist.id,
        name: setlist.name,
        pieces: pieceData,
      }

      return response.status(200).json(updatedSetlistData)
    } catch (error) {
      logger.error('error: ' + error)
      next(error)
    }
  }
)

setlistRouter.delete(
  '/:setlistid/:pieceid',
  async (request, response, next) => {
    try {
      if (!request.token) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      if (!decodedToken.username) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }

      const piece = await BandSetlist.get({
        pk: `PIECE-${request.params.pieceid}`,
        sk: 'PIECE',
      })
      if (!piece) {
        return response.status(404).json({ error: `piece not found` })
      }

      const setlist = await BandSetlist.get({
        pk: `SETLIST-${request.params.setlistid}`,
        sk: 'SETLIST',
      })
      if (!setlist) {
        return response.status(404).json({ error: `setlist not found` })
      }

      let piecesInSetlist = await BandSetlist.query('pk')
        .eq(`SETLIST-${request.params.setlistid}`)
        .where('sk')
        .beginsWith(`PIECE-`)
        .attributes([
          'id',
          'pk',
          'sk',
          'data',
          'setlistName',
          'title',
          'artist',
          'indexInSetlist',
        ])
        .exec()

      let [setlistPiece] = piecesInSetlist.filter(
        (setlistPiece) => setlistPiece.sk === `PIECE-${piece.id}`
      )
      if (!setlistPiece) {
        return response.status(404).json({ error: `piece not in setlist` })
      } else {
        const deletedSetlistIndex = setlistPiece.indexInSetlist
        console.log('deletedSetlistIndex:' + deletedSetlistIndex)
        const setlistPiecesToUpdate = piecesInSetlist.filter(
          (setlistPiece) => setlistPiece.indexInSetlist > deletedSetlistIndex
        )
        console.log(
          'setlistPiecesToUpdate:' + JSON.stringify(setlistPiecesToUpdate)
        )
        setlistPiecesToUpdate.forEach(
          (setlistPiece) => setlistPiece.indexInSetlist--
        )
        console.log(
          'setlistPiecesToUpdate:' + JSON.stringify(setlistPiecesToUpdate)
        )
        await Promise.all(
          setlistPiecesToUpdate.map(async (setlistPiece) => {
            await setlistPiece.save()
          })
        )
        await setlistPiece.delete()
      }

      const updatedSetlist = await BandSetlist.query('pk')
        .eq(`SETLIST-${request.params.setlistid}`)
        .where('sk')
        .beginsWith(`PIECE-`)
        .attributes([
          'id',
          'pk',
          'sk',
          'data',
          'setlistName',
          'title',
          'artist',
          'indexInSetlist',
        ])
        .exec()
      let pieceData = updatedSetlist.map((setlistPiece) => {
        return {
          id: setlistPiece.sk.substring(6),
          title: setlistPiece.title,
          artist: setlistPiece.artist,
          indexInSetlist: setlistPiece.indexInSetlist,
        }
      })
      pieceData.sort((a, b) => a.indexInSetlist - b.indexInSetlist)
      const updatedSetlistData = {
        id: setlist.id,
        name: setlist.name,
        pieces: pieceData,
      }

      return response.status(200).json(updatedSetlistData)
    } catch (error) {
      logger.error('error: ' + error)
      next(error)
    }
  }
)

setlistRouter.delete('/:id', async (req, res, next) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.username) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    const setlistToDelete = await BandSetlist.get({
      pk: `SETLIST-${req.params.id}`,
      sk: 'SETLIST',
    })

    if (!setlistToDelete) {
      return res.status(204).end()
    }

    // Can delete setlist from own band only
    if (
      new String(setlistToDelete.data).valueOf() !=
      new String(`BAND-${decodedToken.username}`).valueOf()
    ) {
      return res.status(404).end()
    }

    // Delete setlist and all related
    const setlistStuffToDelete = await BandSetlist.query({
      pk: `SETLIST-${req.params.id}`,
    }).exec()
    await Promise.all(
      setlistStuffToDelete.map(async (setlistPiece) => {
        await setlistPiece.delete()
      })
    )
    return res.status(204).end()
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

module.exports = setlistRouter
