const express = require("express");
const router = express.Router();

const routesArray = require('../routesArr.json')

router.get('/', (req, res, next) => {
    res.status(200).json({routes: routesArray.arr})
})

module.exports = router;