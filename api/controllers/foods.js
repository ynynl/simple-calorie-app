const foodEntriesRouter = require('express').Router()
const Food = require('../models/food')
const User = require('../models/user')


foodEntriesRouter.get('/', (request, response) => {
    Food.find({}).then(foods => {
        response.json(foods)
    })
})

foodEntriesRouter.get('/:id', (request, response, next) => {
    Food.findById(request.params.id)
        .then(food => {
            if (food) {
                response.json(food)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

foodEntriesRouter.post('/', async (request, response, next) => {
    const body = request.body
    const user = await User.findById(body.userId)

    const food = new Food({
        name: body.name,
        calorie: body.calorie || false,
        date: new Date(),
        user: user._id
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
