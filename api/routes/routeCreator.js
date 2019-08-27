const express = require("express");
const router = express.Router();
const fs = require('fs');
const uniqid = require('uniqid');
const routesArray = require('../routesArr.json')

router.post('/add-new-route', (req, res, next) => {

    const app_path          = './app.js'   
    const analyzedEndpoint  = req.body.endpoint.split('/')
    const routesArrayPath   = './api/routesArr.json'
    let fullEndPoint, endpoint

    if (analyzedEndpoint.length === 1) {
        endpoint        = req.body.endpoint
        fullEndPoint    = req.body.endpoint
    } else {
        fullEndPoint    = req.body.endpoint
        endpoint        = analyzedEndpoint[analyzedEndpoint.length - 1]
    }

    // Handling Duplicated Filenames and Routes
    let routeExists = false
    routesArray.arr.forEach(route => {
        if (route.endpoint === req.body.endpoint) return routeExists = true
        if (fs.existsSync(`./api/routes/${analyzedEndpoint[analyzedEndpoint.length - 1]}.js`))  endpoint = endpoint + uniqid()
    })
    if (routeExists) return res.status(500).json({message:'Route Already Exists'})

    let path1   = `./api/routes/${endpoint}`
    let path2   = `const ${endpoint}Route = require("./api/routes/${endpoint}");`
    let path3   = `app.use('${fullEndPoint}', ${endpoint}Route)`
    let path4   = `./api/JSONDB`
    
    // 
    routesArray.arr.push(req.body)
    fs.writeFile(routesArrayPath, JSON.stringify(routesArray), (err) => {
        if (err) throw err;
    });

    const jsonDB_Data = JSON.stringify(req.body.response)
    fs.writeFile(`${path4}/${endpoint}.json`, jsonDB_Data, (err) => {
        if (err) throw err;
        console.log ('Successfully saved new route');
    });

    const newRoute_data = `
    const express = require("express");
    const router = express.Router();
    const jsonDB = require("../JSONDB/${endpoint}.json");

    router.${req.body.method}('/', (req, res, next) => {
        const data = jsonDB
        res.status(200).json(data)
    })

    module.exports = router;
    `

    // 1. Create new route
    fs.writeFile(`${path1}.js`, newRoute_data, (err) => {
        if (err) throw err;
        console.log ('Successfully saved new route');
    });

    // 2. Update app.js
    fs.readFile(app_path, function read(err, data) { 

        if(err) throw new Error(err)

        // Converting file to an Array
        let dataArray = data.toString().split('\n');

        // 1. Folder Routes
        let index1          = dataArray.indexOf('// Routes Location\r') + 1
        dataArray.splice(index1, 0, path2) 

        // 2. F.E routes
        let index2 = dataArray.indexOf('// Endpoint Routes\r') + 1
        dataArray.splice(index2, 0, path3)
        
        // 3. Update the file
        const updatedData = dataArray.join('\n');
        fs.writeFile(app_path, updatedData, (err) => {
            if (err) throw err;
            res.status(200).json({status: 'Successfully updated the file data'})

        });

    })

})

module.exports = router;