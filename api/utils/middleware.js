const logger = require('./logger')
const jwt = require('jsonwebtoken')

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // admin user
  // const authHeader = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJyb2xlIjoiYWRtaW4iLCJpZCI6IjYzMGI4ZTYwZDkzMzdmODA3Mzg1MDVmZCIsImlhdCI6MTY2MTcyMjExN30.rNOHjyuY8242Fj2gQj5P6uRBbTL0bopO8u7L6ySYkd0'
  // regulaer user
  // const authHeader = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inl5IiwiaWQiOiI2MzBiZDY0ZTY3MjE0MzZlNWNmNTY3YjciLCJpYXQiOjE2NjE3MjA4MDF9.DNcn4i7VsP8VbJasGcUdBta2PzCEdnb2VAml6AkDYms'
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: 'token invalid'
        })
      }

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({
      error: 'token missing'
    })
  }
};

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'MongoServerError') {
    return response.status(400).json({
      error: error.message
    })
  }

  logger.error(error.message)

  next(error)
}



module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  authenticateJWT
}