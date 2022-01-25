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

  app.get('/api/persons/:id',(request, response) => {
    Phonebook.findById(request.params.id).then(person => {
      response.json(person)
    })  
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Name or Number missing' 
      })
    }

   /*  else if(persons.find(x => x.name === body.name)) {
        return response.status(400).json({
            error: 'Name already exists in phonebook'
        })
    } */
  
    const person = new Phonebook({
      name: body.name,
      number: body.number,
    })
  
  
    person.save().then(savedContact => {
      response.json(savedContact)
    })
   
  })

 

  const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })