const express = require("express");
const router = express.Router();
const fs = require('fs');
const uniqid = require('uniqid');
const routesArray = require('../routesArr.json')

router.post('/add-new-route', (req, res, next) => {

    let endpoint = req.body.endpoint

    // Splitting Endpoint to Array
    let splittedEndpoint = endpoint.split('/')

    // Removing Empty Elements
    splittedEndpoint.forEach((element, index) => {
        if(element === '') splittedEndpoint.splice(index, 1)
    });
    
    // Loops through array and create the folder structure and the file
    let Routes_Path = "./api/routes/"
    let JSONDB_Path = "./api/JSONDB/"
    let JSONDB_Path_for_route_part1 = '../'
    let JSONDB_Path_for_route_part2 = ''


    splittedEndpoint.forEach((element,index) => {
        if (index < splittedEndpoint.length - 1) {

            Routes_Path += element + '/'
            JSONDB_Path += element + '/'
            JSONDB_Path_for_route_part1 += "../";
            JSONDB_Path_for_route_part2 += element + '/';


            // Checks if the folder exists, before creating one
            if (!fs.existsSync(`${Routes_Path}`) && !fs.existsSync(`${JSONDB_Path}`)) {
                fs.mkdirSync(`${Routes_Path}`);
                fs.mkdirSync(`${JSONDB_Path}`);
            }

        } else {
            JSONDB_Path_for_route_part2 += element + '.json'
            // JSONDB_Path_for_route += '../JSONDB/Mednext/Common/Proxy/Rest/V1/ClaimDS/queryCountryInformation2.json';
            // Checks if the file exists, before creating one
            if (fs.existsSync(`${Routes_Path}${element}.js`)) return res.status(500).json({message:"This Route Already Exists"})

            // Creates Mock Response
            const jsonDB_Data = JSON.stringify(req.body.response)

            fs.writeFile(`${JSONDB_Path}${element}.json`, jsonDB_Data, (err) => {
                if (err) throw err;
            });

            // Creates Route
            const newRoute_data = `
            const express = require("express");
            const router = express.Router();
            const jsonDB = require("${JSONDB_Path_for_route_part1}JSONDB/${JSONDB_Path_for_route_part2}");

            router.${req.body.method}('/', (req, res, next) => {
                const data = jsonDB
                res.status(200).json(data)
            })

            module.exports = router;
            `

            fs.writeFile(`${Routes_Path}${element}.js`, newRoute_data, (err) => {
                if (err) throw err;
                return res.status(500).json({message:"New Route successfully created"})
            });

            // 2. Update app.js
            const app_path          = './app.js'   
            let uniqueEndpointRouteVar = splittedEndpoint[splittedEndpoint.length - 1] + 'Route' + uniqid()
            let path2   = `const ${uniqueEndpointRouteVar} = require("${Routes_Path}${element}");`
            
            // Updating the routeArr File in order to get the data of the routes
            req.body.uniqueName = uniqueEndpointRouteVar
            const routesArrayPath   = './api/routesArr.json'
            routesArray.arr.push(req.body)
            fs.writeFile(routesArrayPath, JSON.stringify(routesArray), (err) => {
                if (err) throw err;
            });

            // Actually updating app.js 
            fs.readFile(app_path, function read(err, data) { 

                if(err) throw new Error(err)

                // Converting file to an Array
                let dataArray = data.toString().split('\n');

                // 1. Folder Routes
                let index1          = dataArray.indexOf('// Routes Location\r') + 1
                dataArray.splice(index1, 0, path2) 

                // // 2. F.E routes
                // let index2 = dataArray.indexOf('// Endpoint Routes\r') + 1
                // dataArray.splice(index2, 0, path3)
                
                // 3. Update the file
                const updatedData = dataArray.join('\n');
                fs.writeFile(app_path, updatedData, (err) => {
                    if (err) throw err;
                    // res.status(200).json({status: 'Successfully updated the file data'})

                });

            })

        }
    })
    


    // res.status(200).json({message:"add-new-route"})

    // ========================================== //
    //         OLD IMPLEMENTATION BELOW
    // ========================================== //
    // const app_path          = './app.js'   
    // const analyzedEndpoint  = req.body.endpoint.split('/')
    // const routesArrayPath   = './api/routesArr.json'
    // let fullEndPoint, endpoint

    // if (analyzedEndpoint.length === 1) {
    //     endpoint        = req.body.endpoint
    //     fullEndPoint    = req.body.endpoint
    // } else {
    //     fullEndPoint    = req.body.endpoint
    //     endpoint        = analyzedEndpoint[analyzedEndpoint.length - 1]
    // }

    // // Handling Duplicated Filenames and Routes
    // let routeExists = false
    // routesArray.arr.forEach(route => {
    //     if (route.endpoint === req.body.endpoint) return routeExists = true
    //     if (fs.existsSync(`./api/routes/${analyzedEndpoint[analyzedEndpoint.length - 1]}.js`))  endpoint = endpoint + uniqid()
    // })
    // if (routeExists) return res.status(500).json({message:'Route Already Exists'})

    // let path1   = `./api/routes/${endpoint}`
    // let path2   = `const ${endpoint}Route = require("./api/routes/${endpoint}");`
    // let path3   = `app.use('${fullEndPoint}', ${endpoint}Route)`
    // let path4   = `./api/JSONDB`
    
    // // 
    // routesArray.arr.push(req.body)
    // fs.writeFile(routesArrayPath, JSON.stringify(routesArray), (err) => {
    //     if (err) throw err;
    // });

    // const jsonDB_Data = JSON.stringify(req.body.response)
    // fs.writeFile(`${path4}/${endpoint}.json`, jsonDB_Data, (err) => {
    //     if (err) throw err;
    //     console.log ('Successfully saved new route');
    // });

    // const newRoute_data = `
    // const express = require("express");
    // const router = express.Router();
    // const jsonDB = require("../JSONDB/${endpoint}.json");

    // router.${req.body.method}('/', (req, res, next) => {
    //     const data = jsonDB
    //     res.status(200).json(data)
    // })

    // module.exports = router;
    // `

    // // 1. Create new route
    // fs.writeFile(`${path1}.js`, newRoute_data, (err) => {
    //     if (err) throw err;
    //     console.log ('Successfully saved new route');
    // });

    // // 2. Update app.js
    // fs.readFile(app_path, function read(err, data) { 

    //     if(err) throw new Error(err)

    //     // Converting file to an Array
    //     let dataArray = data.toString().split('\n');

    //     // 1. Folder Routes
    //     let index1          = dataArray.indexOf('// Routes Location\r') + 1
    //     dataArray.splice(index1, 0, path2) 

    //     // 2. F.E routes
    //     let index2 = dataArray.indexOf('// Endpoint Routes\r') + 1
    //     dataArray.splice(index2, 0, path3)
        
    //     // 3. Update the file
    //     const updatedData = dataArray.join('\n');
    //     fs.writeFile(app_path, updatedData, (err) => {
    //         if (err) throw err;
    //         res.status(200).json({status: 'Successfully updated the file data'})

    //     });

    // })

})

module.exports = router;