const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to mongodb');

mongoose.connect(url)
    .then(res => console.log('connected successfully'))
    .catch(err => console.log('connection failed', err.message));

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
});

personSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString();
        delete returnedObj._id;
        delete returnedObj.__v;
    }
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;


