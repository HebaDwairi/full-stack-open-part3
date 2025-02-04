const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(morgan('tiny'));

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

app.get('/api/persons', (request, response) => {
    response.json(persons);
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

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const newPerson = request.body;

    if(!(newPerson.name && newPerson.number)){
        return response.status(400).json({
            error: "missing name or number" 
        });
    }

    if(persons.find(person => person.name === newPerson.name)){
        return response.status(400).json({
            error: "name must be unique"
        });
    }

    newPerson.id = String(Math.floor(Math.random() * 1000000));
    persons = persons.concat(newPerson);

    response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});