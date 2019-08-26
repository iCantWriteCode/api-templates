
    const express = require("express");
    const router = express.Router();
    const jsonDB = require("../JSONDB/queryCustomerByCriteria.json");

    router.post('/', (req, res, next) => {
        const data = jsonDB
        res.status(200).json(data)
    })

    module.exports = router;
    