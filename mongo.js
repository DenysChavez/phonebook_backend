const mongoose = require("mongoose");
const Person = require("./models/person");

const password = process.argv[2];

const url = `mongodb+srv://dvchf26:${password}@notes.zzmg6t9.mongodb.net/?retryWrites=true&w=majority&appName=phonebookApp`;

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

mongoose.set("strictQuery", false);
mongoose.connect(url);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");

    result.forEach((person) => {
      console.log(`${person.name.padEnd(20)} ${person.number}`);
    });
    mongoose.connection.close();
    process.exit(1);
  });
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(() => {
    console.log("person saved!");
    mongoose.connection.close();
    process.exit(1);
  });
}