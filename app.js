const express = require('express')
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express()
const port = 9000

// Routes Location
const queryStuffByCriteriaRoute = require("./api/routes/queryStuffByCriteria");
const queryCustomerByCriteriaRoute = require("./api/routes/queryCustomerByCriteria");
const queryTasksByCriteriaRoute = require("./api/routes/queryTasksByCriteria");
const queryClaimTaskByCriteriaRoute = require("./api/routes/queryClaimTaskByCriteria");
const getRoutes = require("./api/routes/getRoutes");
const routeCreator = require("./api/routes/routeCreator");
// const testRoute = require("./api/routes/test");

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

// Endpoint Routes
app.use('/Mednext/queryStuffByCriteria', queryStuffByCriteriaRoute)
app.use('/Mednext/queryCustomerByCriteria', queryCustomerByCriteriaRoute)
app.use('/Mednext/queryTasksByCriteria', queryTasksByCriteriaRoute)
app.use('/Mednext/queryClaimTaskByCriteria', queryClaimTaskByCriteriaRoute)
app.use('/getRoutes', getRoutes)
app.use('/routeCreator', routeCreator)
// app.use('/testRoute', testRoute)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))