
    const express = require("express");
    const router = express.Router();
    const jsonDB = require("../JSONDB/queryClaimTaskByCriteria.json");

    router.get('/', (req, res, next) => {
        const data = jsonDB
        res.status(200).json(data)
    })

    module.exports = router;
    