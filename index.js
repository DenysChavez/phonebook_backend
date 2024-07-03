const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const app = express();
app.use(requestLogger);
app.use(cors());

morgan.token("body", (req) => JSON.stringify(req.body));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.json());

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <br/> <p>${date}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = persons.find(p => p.id == id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    persons = persons.filter((p) => p.id != id)
    console.log(persons);
    response.status(204).end
})

app.post("/api/persons", (request, response) => {
    const body = request.body;
    const personToFind = persons.filter((p) => p.name == body.name)
    
    if (!body.name || !body.number) {
        return response.status(404).json({
            error: "name or number missing"
        })
    } else if (personToFind) {
        return response.status(404).json({
            error: "name must be unique"
        })
    }

    const person = {
        id: Math.floor(Math.random() * 99),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})