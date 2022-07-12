const setlistRouter = require('express').Router()
const Band = require('../models/band')
const Setlist = require('../models/setlist')
const Piece = require('../models/piece')
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
    let setlists = await Setlist.scan('band')
      .eq(decodedToken.username)
      .attributes(['id', 'name', 'pieces'])
      .exec()
    // Read some properties for pieces
    const populatedSetlists = await Promise.all(
      setlists.map(async (setlist) => {
        if (setlist.pieces.length > 0) {
          setlist.pieces = await Piece.batchGet(setlist.pieces, {
            attributes: ['id', 'title', 'artist'],
          })
        }
        return setlist
      })
    )
    response.json(populatedSetlists)
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
    const band = await Band.get(decodedToken.username)
    const body = request.body
    if (typeof body.name === 'undefined') {
      return response.status(400).json({ error: '`name` is required' })
    }
    if (body.name.length < 3) {
      return response.status(400).json({
        error: `name length ${body.name.length} is shorter than the minimum allowed length (3)`,
      })
    }
    const setlist = {
      id: uuidv4(),
      name: body.name,
      band: decodedToken.username,
      pieces: [],
    }
    const newSetlist = new Setlist(setlist)
    const savedSetlist = await newSetlist.save()
    if (!band.setlists) {
      band.setlists = []
    }
    band.setlists = band.setlists.concat(savedSetlist.id)
    await band.save()
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

    const piece = await Piece.get(request.params.pieceid)
    if (!piece) {
      return response.status(404).json({ error: `piece not found` })
    }

    var setlist = await Setlist.get(request.params.setlistid)
    if (!setlist) {
      return response.status(404).json({ error: `setlist not found` })
    }

    if (!setlist.pieces) {
      setlist.pieces = []
    }
    const pieceIndex = setlist.pieces.indexOf(piece.id)
    if (pieceIndex >= 0) {
      return response.status(400).json({
        error: `piece is already in setlist`,
      })
    }

    var updatedSetlist = await Setlist.update(
      { id: request.params.setlistid },
      { $ADD: { pieces: piece.id } }
    )
    if (updatedSetlist.pieces.length > 0) {
      updatedSetlist.pieces = await Piece.batchGet(updatedSetlist.pieces, {
        attributes: ['id', 'title', 'artist'],
      })
    }

    return response.status(200).json(updatedSetlist)
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

const arraymove = (arr, fromIndex, toIndex) => {
  var element = arr[fromIndex]
  arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
}

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

      const piece = await Piece.get(request.params.pieceid)
      if (!piece) {
        return response.status(404).json({ error: `piece not found` })
      }

      var setlist = await Setlist.get(request.params.setlistid)
      if (!setlist) {
        return response.status(404).json({ error: `setlist not found` })
      }

      const pieceIndex = setlist.pieces.indexOf(piece.id)
      if (pieceIndex < 0) {
        return response.status(404).json({
          error: `piece not in setlist`,
        })
      }

      if (request.params.dir == 'up') {
        if (pieceIndex > 0) {
          arraymove(setlist.pieces, pieceIndex, pieceIndex - 1)
          await setlist.save()
        }
      } else if (request.params.dir == 'down') {
        if (pieceIndex < setlist.pieces.length - 1) {
          arraymove(setlist.pieces, pieceIndex, pieceIndex + 1)
          await setlist.save()
        }
      } else {
        return response.status(400).json({
          error: `invalid direction, only up and down are allowed`,
        })
      }

      const updatedSetlist = await Setlist.get(setlist.id, {
        attributes: ['id', 'name', 'pieces'],
      })
      if (updatedSetlist.pieces.length > 0) {
        updatedSetlist.pieces = await Piece.batchGet(updatedSetlist.pieces, {
          attributes: ['id', 'title', 'artist'],
        })
      }
      return response.status(200).json(updatedSetlist)
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

      const piece = await Piece.get(request.params.pieceid)
      if (!piece) {
        return response.status(404).json({ error: `piece not found` })
      }

      var setlist = await Setlist.get(request.params.setlistid)
      if (!setlist) {
        return response.status(404).json({ error: `setlist not found` })
      }

      const pieceIndex = setlist.pieces.indexOf(piece.id)
      if (pieceIndex >= 0) {
        setlist.pieces.splice(pieceIndex, 1)
        await setlist.save()
      }

      const updatedSetlist = await Setlist.get(setlist.id, {
        attributes: ['id', 'name', 'pieces'],
      })
      if (updatedSetlist.pieces.length > 0) {
        updatedSetlist.pieces = await Piece.batchGet(updatedSetlist.pieces, {
          attributes: ['id', 'title', 'artist'],
        })
      }

      return response.status(200).json(updatedSetlist)
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
    let setlistToDelete = await Setlist.get(req.params.id)

    if (!setlistToDelete) {
      return res.status(204).end()
    }

    // Can delete setlist from own band only
    if (
      new String(setlistToDelete.band).valueOf() !=
      new String(decodedToken.username).valueOf()
    ) {
      return res.status(404).end()
    }

    // Delete setlist from band
    let band = await Band.get(setlistToDelete.band)
    var setlistIndex = band.setlists.indexOf(req.params.id)
    band.setlists.splice(setlistIndex, 1)
    await band.save()
    await setlistToDelete.delete()
    return res.status(204).end()
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

module.exports = setlistRouter
