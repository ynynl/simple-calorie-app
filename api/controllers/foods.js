const foodEntriesRouter = require('express').Router()
const Food = require('../models/food')
const User = require('../models/user')
const middleware = require('../utils/middleware')

foodEntriesRouter.get('/', middleware.authenticateJWT, (request, response) => {
    const { role } = request.user;

    if (role !== 'admin') {
        return response.sendStatus(403);
    }

    Food.find({}).then(foods => {
        response.json(foods)
    })
})

foodEntriesRouter.get('/:id', async (request, response) => {
    const { role } = request.user;

    if (role !== 'admin') {
        return response.sendStatus(403);
    }

    const food = await Food.findById(request.params.id)
    if (food) {
        response.json(food)
    } else {
        response.status(404).end()
    }
})

foodEntriesRouter.post('/', middleware.authenticateJWT, async (request, response, next) => {
    try {
        const body = request.body

        const user = await User.findById(request.user.id)

        const food = new Food({
            name: body.name,
            calorie: body.calorie,
            date: body.date || new Date(),
            price: body.price,
            user: user._id
        })

        const savedFood = await food.save()
        user.foodEntries = user.foodEntries.concat(savedFood._id)
        await user.save()

        response.json(savedFood)
    } catch (error) {
        next(error)
    }
})

foodEntriesRouter.delete('/:id', middleware.authenticateJWT, (request, response, next) => {
    const { role } = request.user;

    if (role !== 'admin') {
        return response.sendStatus(403);
    }

    Food.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

foodEntriesRouter.put('/:id', middleware.authenticateJWT, (request, response, next) => {
    const { role } = request.user;

    if (role !== 'admin') {
        return response.sendStatus(403);
    }

    const body = request.body

    const food = {
        name: body.name,
        calorie: body.calorie,
        price: body.price,
        date: body.date,
    }

    Food.findByIdAndUpdate(request.params.id, food, { new: true })
        .then(updatedfood => {
            response.json(updatedfood)
        })
        .catch(error => next(error))
})

module.exports = foodEntriesRouter
