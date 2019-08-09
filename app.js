const express = require('express')
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express()
const port = 9000

// Routes Location
const routeCreator = require("./api/routes/routeCreator");

// Midlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// FrontEnd Route
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/swagger', (req, res) => res.send('Hello swagger!'))

// Endpoint Routes
app.use('/routeCreator', routeCreator)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))