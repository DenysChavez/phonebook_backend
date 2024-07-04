const mongoose = require("mongoose");

const password = process.argv[2];
  
const url = `mongodb+srv://dvchf26:${password}@notes.zzmg6t9.mongodb.net/?retryWrites=true&w=majority&appName=phonebookApp`;
      

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

mongoose.set("strictQuery", false);
mongoose.connect(url);
const personSchema = new mongoose.Schema({
      name: String,
      number: String,
      id: String,
});

const Person = mongoose.model("Person", personSchema);


if (process.argv.length === 4) {
    console.log("name or number missing");
    process.exit(1)

} else if (process.argv.length === 5) {
  
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
        name: name,
        number: number,
        id: String(Math.floor(Math.random() * 9878473)),
    });

      person.save().then((result) => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
      });
} else {
    Person.find({}).then((result) => {
        console.log("phonebook:");
        result.forEach((p) => {
            console.log(`${p.name} ${p.number}`);
        });
     mongoose.connection.close();
   });
  }


