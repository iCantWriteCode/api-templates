// @ts-check

const express       = require("express");
const router        = express.Router();
const fs            = require('fs');
const uniqid        = require('uniqid');
const routesArray   = require('../routesArr.json')

router.post('/add-new-route', (req, res, next) => {

    let endpoint = req.body.endpoint
    req.body.id = uniqid()
    // Splitting Endpoint to Array
    let splittedEndpoint = endpoint.split('/')

    // Removing Empty Elements
    splittedEndpoint.forEach((element, index) => {
        if(element === '') splittedEndpoint.splice(index, 1)
    });
    
    // Paths for the files
    let Routes_Path                 = "./api/routes/"
    let JSONDB_Path                 = "./api/JSONDB/"
    let JSONDB_Path_for_route_part1 = '../'
    let JSONDB_Path_for_route_part2 = ''

    // Loops through array and create the folder structure and the file
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
            
            // Checks if the file exists, before creating one
            if (fs.existsSync(`${Routes_Path}${element}.js`)) {
                console.log('?');
                
                return res.status(400).json({message:"This Route Already Exists"})
            }

            // Creates Mock Response
            const jsonDB_Data = JSON.stringify(req.body.response)

            fs.writeFile(`${JSONDB_Path}${element}.json`, jsonDB_Data, (err) => {
                if (err) throw err;
            });

            // Creates Route
            const newRoute_data =
`const express = require("express");
const router = express.Router();
const jsonDB = require("${JSONDB_Path_for_route_part1}JSONDB/${JSONDB_Path_for_route_part2}");

router.${req.body.method}('/', (req, res, next) => {
    // Default Route
    const data = jsonDB
    res.status(200).json(data)
    // End Of Default Route
})

module.exports = router;
`

            fs.writeFile(`${Routes_Path}${element}.js`, newRoute_data, (err) => {
                if (err) throw err;
                return res.status(200).json({message:"New Route successfully created"})
            });

            // 2. Update app.js
            const app_path          = './app.js'   
            let uniqueEndpointRouteVar = splittedEndpoint[splittedEndpoint.length - 1] + 'Route' + uniqid()
            let path2   = `const ${uniqueEndpointRouteVar} = require("${Routes_Path}${element}");`
            
            // Updating the routeArr File in order to get the data of the routes
            req.body.uniqueName = uniqueEndpointRouteVar
            const routesArrayPath   = './api/routesArr.json'
            console.log(req.body);
            req.body.possibleResponses = [
                { 
                    "defalt":true,
                    "condition":null,
                    "response":req.body.response
                }
            ]
            delete req.body.response
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

})

router.post('/add-rules-to-route', (req, res, next) => {

    let routeOutcomes               = ' '
    let JSONDBOutcomes              = ' '
    let JSONDB_Path_for_route_part1 = ''
    let JSONDB_Path_for_route_part2 = ''
    let splitedEndpointArr          = req.body.data.endpoint.split('/')

    splitedEndpointArr.forEach((element, index) => { 
        if (index !== splitedEndpointArr.length - 1) JSONDB_Path_for_route_part1 += '../'
    })
    JSONDB_Path_for_route_part1 += 'JSONDB'


    let defaultDB = `const jsonDB = require('${JSONDB_Path_for_route_part1}${req.body.data.endpoint}')`
    let defaultRouteLogic = `
    else {
        const data = jsonDB
        res.status(200).json(data)
    }
    `

    let routeIndex = 0 
    routesArray.arr.forEach((element, i) => {
        if (element.id === req.body.data.id) routeIndex = i
    })

    req.body.logic.forEach(logic => {


        JSONDB_Path_for_route_part2 = ''
        splitedEndpointArr.forEach((element, index) => { 
            if (index !== splitedEndpointArr.length -1 ) JSONDB_Path_for_route_part2 += element + '/';
            else JSONDB_Path_for_route_part2 += element + logic.requestVariable + logic.value + '.json'
        })
       
        routeOutcomes += `
            ${logic.active ? '' : '//'} if (req.body.${logic.requestVariable} ${logic.operator === '=' ? '===' : '!=='} '${logic.value}' ) {
                ${logic.active ? '' : '//'} const data = jsonDB${logic.requestVariable}${logic.value}
                ${logic.active ? '' : '//'} return res.status(200).json(data)
            ${logic.active ? '' : '//'} }
            `
        JSONDBOutcomes += `const jsonDB${logic.requestVariable}${logic.value} = require("${JSONDB_Path_for_route_part1}${JSONDB_Path_for_route_part2}") \n`

        if (!fs.existsSync(`./api/JSONDB/${JSONDB_Path_for_route_part2}`)) {
            fs.writeFile(`./api/JSONDB/${JSONDB_Path_for_route_part2}`, logic.response, (err) => {
                if (err) return res.status(400).json({message:"This file already exists"})
            });
        }

        routesArray.arr[routeIndex].possibleResponses.push({
            "defalt":false,
            "condition": `if (req.body.${logic.requestVariable} ${logic.operator === '=' ? '===' : '!=='} '${logic.value}'`,
            "response":logic.response
        })
        // console.log('routesArray',routesArray);
        const routesArrayPath   = './api/routesArr.json'
        fs.writeFile(routesArrayPath, JSON.stringify(routesArray), (err) => {
            if (err) throw err;
        });

    })

    const newFile = 
`
const express = require("express");
const router = express.Router();
${defaultDB}
${JSONDBOutcomes}
router.post('/', (req, res, next) => {
    ${routeOutcomes}
    ${defaultRouteLogic}
})

module.exports = router;
    
`
        
        // console.log(routeIndex);

        // req.body.logic.forEach((element, i) => {
            
        // })

        

    // console.log(routesArray)
    
    
    fs.writeFile(`./api/routes${req.body.data.endpoint}.js`, newFile, (err) => {
        if (err) return console.log(err)
        else  res.status(200).json({message: 'New rules added successfully'})
    });

})

module.exports = router; 