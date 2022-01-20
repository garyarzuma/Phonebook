const express = require('express')
const app = express()
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(express.json())
app.use(morgan('combined', { stream: accessLogStream }))

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
    response.json(persons)
  })

  app.get('/info',(request, response) => {
    const text = `Phonebook has info for ${persons.length} people </br></br> ${Date()}`
   
    response.send(text)
    
  })

  app.get('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(n=>n.id===id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    
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

    else if(persons.find(x => x.name === body.name)) {
        return response.status(400).json({
            error: 'Name already exists in phonebook'
        })
    }
  
    const person = {
      name: body.name,
      number: body.number || false,
      id: Math.floor(Math.random()*10000)
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })