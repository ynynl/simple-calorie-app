const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const middleware = require('../utils/middleware')


usersRouter.get('/', middleware.authenticateJWT, async (request, response) => {
  const { role } = request.user;

  if (role !== 'admin') {
    return response.sendStatus(403);
  }
  const users = await User
    .find({}).populate('foodEntries', { name: 1, date: 1, calorie: 1, price: 1 })

  response.json(users)
})

usersRouter.get('/:id', middleware.authenticateJWT, async (request, response) => {
  try {
    const { role, id } = request.user;

    console.log(request.user);

    if (role !== 'admin' && request.params.id !== id) {
      return response.sendStatus(403);
    }

    const users = await User.findById(id)
      .populate('foodEntries', { name: 1, date: 1, calorie: 1, price: 1 })

    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      role: 'user',
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)

  } catch (error) {
    next(error)
  }

})

module.exports = usersRouter