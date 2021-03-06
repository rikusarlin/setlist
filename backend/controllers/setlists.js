const setlistRouter = require('express').Router()
const Band = require('../models/band')
const Setlist = require('../models/setlist')
const Piece = require('../models/piece')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

setlistRouter.get('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    let setlists = await Setlist.find(
      { band: decodedToken.id },
      { name: 1 }
    ).populate('pieces', { title: 1, artist: 1, id: 1 })
    response.json(setlists)
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

setlistRouter.post('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const band = await Band.findById(decodedToken.id)
    const body = request.body
    if (typeof body.name === 'undefined') {
      return response.status(400).json({ error: '`name` is required' })
    }
    if (body.name.length < 3) {
      return response.status(400).json({
        error: `name length ${body.name.length} is shorter than the minimum allowed length (3)`,
      })
    }
    const setlist = new Setlist({
      name: body.name,
      band: decodedToken.id,
    })
    const savedSetlist = await setlist.save()
    band.setlists = band.setlists.concat(savedSetlist._id)
    await band.save()
    response.status(201).json(savedSetlist)
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

setlistRouter.put('/:setlistid/:pieceid', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const piece = await Piece.findById(request.params.pieceid)
    if (!piece) {
      response.status(404).json({ error: `piece not found` })
    }

    var setlist = await Setlist.findById(request.params.setlistid)
    if (!setlist) {
      response.status(404).json({ error: `setlist not found` })
    }

    const pieceIndex = setlist.pieces.indexOf(piece.id)
    if (pieceIndex >= 0) {
      response.status(400).json({
        error: `piece is already in setlist`,
      })
    }

    setlist.pieces = setlist.pieces.concat(piece.id)
    await setlist.save()

    const updatedSetlist = await Setlist.findById(setlist.id, {
      name: 1,
    }).populate('pieces', { title: 1, artist: 1, id: 1 })

    response.status(200).json(updatedSetlist)
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
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }

      const piece = await Piece.findById(request.params.pieceid)
      if (!piece) {
        response.status(404).json({ error: `piece not found` })
      }

      var setlist = await Setlist.findById(request.params.setlistid)
      if (!setlist) {
        response.status(404).json({ error: `setlist not found` })
      }

      const pieceIndex = setlist.pieces.indexOf(piece.id)
      if (pieceIndex < 0) {
        response.status(404).json({
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
        response.status(400).json({
          error: `invalid direction, only up and down are allowed`,
        })
      }

      const updatedSetlist = await Setlist.findById(setlist.id, {
        name: 1,
      }).populate('pieces', { title: 1, artist: 1, id: 1 })

      response.status(200).json(updatedSetlist)
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
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }

      const piece = await Piece.findById(request.params.pieceid)
      if (!piece) {
        response.status(404).json({ error: `piece not found` })
      }

      var setlist = await Setlist.findById(request.params.setlistid)
      if (!setlist) {
        response.status(404).json({ error: `setlist not found` })
      }

      const pieceIndex = setlist.pieces.indexOf(piece.id)
      if (pieceIndex >= 0) {
        setlist.pieces.splice(pieceIndex, 1)
        await setlist.save()
      }

      const updatedSetlist = await Setlist.findById(setlist.id, {
        name: 1,
      }).populate('pieces', { title: 1, artist: 1, id: 1 })

      response.status(200).json(updatedSetlist)
    } catch (error) {
      logger.error('error: ' + error)
      next(error)
    }
  }
)

setlistRouter.delete('/:id', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    let setlistToDelete = await Setlist.findById(req.params.id)

    if (!setlistToDelete) {
      return res.status(204).end()
    }

    // Can delete setlist from own band only
    if (
      new String(setlistToDelete.band).valueOf() !=
      new String(decodedToken.id).valueOf()
    ) {
      return res.status(404).end()
    }

    // Delete setlist from band
    const band = await Band.findById(setlistToDelete.band._id)
    var setlistIndex = band.setlists.indexOf(req.params.id)
    band.setlists.splice(setlistIndex, 1)
    await band.save()
    await Setlist.findByIdAndRemove(req.params.id).setOptions({
      useFindAndModify: false,
    })
    return res.status(204).end()
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

module.exports = setlistRouter
