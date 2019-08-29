const express = require('express')
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express()
const port = 9000

// Routes Location
const getRoutes = require("./api/routes/getRoutes");
const routeCreator = require("./api/routes/routeCreator");

// Midlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json()
    }
    next();
});

// FrontEnd Route
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/swagger', (req, res) => res.send('Hello swagger!'))

// Using all route dynamically. This for fewer lines
let routes = require('./api/routesArr')
routes.arr.forEach(element => {
  app.use(`${element.endpoint}`, eval(element.uniqueName))
})

// Endpoint Routes
app.use('/getRoutes', getRoutes)
app.use('/routeCreator', routeCreator)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))