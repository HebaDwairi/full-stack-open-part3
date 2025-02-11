const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to mongodb');

mongoose.connect(url)
    .then(res => console.log('connected successfully'))
    .catch(err => console.log('connection failed', err.message));


const customNumberValidator = (num) => {
    const regex = /(?=.{9,})^\d{2,3}-\d*$/;
    return regex.test(num);
}
const custom = [customNumberValidator, 'number should be at least 8 digits long, format: xxx-xxxxx... or xx-xxxxxx...'];
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        validate : custom
    }
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


