const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const app = express();
app.use(express.static("dist"));
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
    Person.find({}).then((p) => {
        response.json(p)
    })
})

app.get("/info", (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${Person.length} people</p> <br/> <p>${date}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then((p) => {
        response.json(p)
    })
})

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        }).catch(error => next(error))
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: "name or number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})