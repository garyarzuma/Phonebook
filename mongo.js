const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://garyarzuma:${password}@cluster0.6ziqn.mongodb.net/contactsDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

 const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length==3){
    Person.find({}).then(
        function (x) {
            x.map(x => {
                console.log(x.name+ " " + x.number)
                mongoose.connection.close()
            }
            )
        }
)}

else{
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
    }) 
}