require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./models/phonebook')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('gary1', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :gary1'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
  
  app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(persons => response.json(persons))
  })

  app.get('/info',(request, response) => {
    Phonebook.count({},(err,count)=>{
      const text = `Phonebook has info for ${count} people </br></br> ${Date()}`
      response.send(text)
    })
  })

  app.get('/api/persons/:id',(request, response, next) => {
    Phonebook.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))  
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    Phonebook.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Phonebook.findByIdAndUpdate(request.params.id, person, { new: true,  runValidators: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

  app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const person = new Phonebook({
      name: body.name,
      number: body.number,
    })
  
    person.save()
    .then(savedContact => {
      response.json(savedContact)
    })
    .catch(error=>next(error))
  })

  const errorHandler = (error, request, response, next) => {
     if (error.name === 'CastError') {
      return response.status(404).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(404).send({ error: error }) //sends validation error in response so we can get this in the frontend code
    }    
    
    next(error)
  } 
  // this has to be the last loaded middleware.
  app.use(errorHandler)

  const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })