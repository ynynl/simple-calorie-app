const mongoose = require('mongoose')
const config = require('../utils/config')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(config.MONGODB_URI)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const foodSchema = new mongoose.Schema({
    food: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    calorie: {
        type: Number,
        required: true,
        default: 0
    },
    price: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

foodSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Food', foodSchema)