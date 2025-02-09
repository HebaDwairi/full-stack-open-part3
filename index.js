require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());


morgan.token('data', (request, response)=>{
    return JSON.stringify(request.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(result => {
        response.json(result);
    }).catch(err => next(err))
});

app.get('/info', (request, response) => {
    const count = persons.length;
    const time = new Date();

    response.send(`Phonebook has info for ${count} people <br/> ${time}`);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);

    if(person){
        response.json(person);
    }
    else{
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;

    Person.findByIdAndDelete(id)
        .then(res => console.log('deleted successfully'))
        .catch(err => next(err));

});

app.post('/api/persons', (request, response, next) => {
    const body = request.body;

    if(!(body.name && body.number)){
        const err = new Error("missing name or number");
        err.status = 400;
        return next(err);
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    });

    newPerson.save()
        .then(res => {
            console.log('person was added');
            response.json(newPerson);
        })
        .catch(err => console.log(err));
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if(error.name === 'CastError'){
        response.status(400).send({error: 'malformatted id'});
    }
    if(error.name === 'ValidationError'){
        response.status(400).send({error: 'missing name or number'});
    }

    response.status(error.status || 500).send({error: error.message || 'internal server error'});
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});