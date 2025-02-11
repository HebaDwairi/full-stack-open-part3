require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());


morgan.token('data', (request) => {
  return JSON.stringify(request.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));


app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
    response.json(result);
  }).catch(err => next(err))
});

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(res => {
      const count = res;
      const time = new Date();

      response.send(`Phonebook has info for ${count} people <br/> ${time}`);
    })
    .catch(err => next(err));
});

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then(res => {
      if(res){
        response.json(res);
      }
      else{
        response.status(404).end();
      }
    })
    .catch(err => next(err));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch(err => next(err));

});


app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if(!body.number){
    const err = new Error('missing number');
    err.status = 400;
    return next(err);
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  });

  newPerson.save()
    .then(() => {
      console.log('person was added');
      response.json(newPerson);
    })
    .catch(err => next(err));
});

app.put('/api/persons/:id', (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then((res) => response.json(res))
    .catch(err => next(err));
});

const errorHandler = (error, request, response) => {
  console.error(error.message);

  if(error.name === 'CastError'){
    response.status(400).send({ error: 'malformatted id' });
  }
  if(error.name === 'ValidationError'){
    response.status(400).send({ error: error.message });
  }

  response.status(error.status || 500).send({ error: error.message || 'internal server error' });
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});