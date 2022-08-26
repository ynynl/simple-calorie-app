const foodEntriesRouter = require('express').Router()
const Food = require('../models/food')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenId = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      const token =  authorization.substring(7)
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (decodedToken.id) {
        return decodedToken.id
      }
    }
    return null
  }

foodEntriesRouter.get('/', (request, response) => {
    Food.find({}).then(foods => {
        response.json(foods)
    })
})

foodEntriesRouter.get('/:id', async (request, response) => {
    const food = await Food.findById(request.params.id)
    if (food) {
        response.json(food)
    } else {
        response.status(404).end()
    }
})

foodEntriesRouter.post('/', async (request, response, next) => {
    const body = request.body

    const tokenId = getTokenId(request)
    if (!tokenId) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(tokenId)

    const food = new Food({
        name: body.name,
        calorie: body.calorie || false,
        date: new Date(),
        user: tokenId
    })

    const savedFood = await food.save()
    user.foodEntries = user.foodEntries.concat(savedFood._id)
    await user.save()
    
    response.json(savedFood)
})

foodEntriesRouter.delete('/:id', (request, response, next) => {
    Food.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

foodEntriesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const food = {
        name: body.name,
        calorie: body.calorie,
    }

    Food.findByIdAndUpdate(request.params.id, food, { new: true })
        .then(updatedfood => {
            response.json(updatedfood)
        })
        .catch(error => next(error))
})

module.exports = foodEntriesRouter
