const express = require("express");
const router = express.Router();
const fs = require('fs');

const routesArray = require('../routesArr.json')

router.post('/add-new-route', (req, res, next) => {

    const app_path  = './app.js'   
    let fullEndPoint, endpoint

    const analyzedEndpoint = req.body.endpoint.split('/')

    // Error Handling
    if (fs.existsSync(`./api/routes/${analyzedEndpoint[analyzedEndpoint.length - 1]}.js`)) return res.status(500).json({message:'Route Already Exists'})

    // Start: Add route to swagger
    const routesArrayPath = './api/routesArr.json'

    // Check if file exists
    if (!fs.existsSync(routesArrayPath)) return res.status(500).json({message:'An Error Has occured'})
    routesArray.arr.push(req.body)
    fs.writeFile(routesArrayPath, JSON.stringify(routesArray), (err) => {
        if (err) throw err;
    });
    // End: Add route to swagger

    if (analyzedEndpoint.length === 1) {
        endpoint        = req.body.endpoint
        fullEndPoint    = req.body.endpoint

    } else {
        fullEndPoint    = req.body.endpoint
        endpoint        = analyzedEndpoint[analyzedEndpoint.length - 1]
    }

    let path1   = `./api/routes/${endpoint}`
    let path2   = `const ${endpoint}Route = require("./api/routes/${endpoint}");`
    let path3   = `app.use('/${fullEndPoint}', ${endpoint}Route)`
    let path4   = `./api/JSONDB`

    const jsonDB_Data = JSON.stringify(req.body.response)
    fs.writeFile(`${path4}/${endpoint}.json`, jsonDB_Data, (err) => {
        if (err) throw err;
        console.log ('Successfully saved new route');
    });

    // TODO DA MOCK: Needs to send back the mock json 
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