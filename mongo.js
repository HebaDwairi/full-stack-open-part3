const mongoose = require('mongoose');

const len = process.argv.length;

if(len < 3){
    console.log('you should provide password as argument');
    process.exit(1);
}
else if(len === 4){
    console.log('you should provide both name and number as arguments');
    process.exit(1);
}

const password = process.argv[2];
const url =`mongodb+srv://hebaDwairi:${password}@cluster0.zyous.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
});

const Person = mongoose.model('Person', personSchema);

if(len === 3){
    Person.find({}).then((result) => {
        console.log('phonebook: ');
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    })
    .catch(err => console.log(err));
}
else{
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person.save().then(res => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
    });
}

