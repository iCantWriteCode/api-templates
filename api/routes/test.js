const express = require("express");
const router = express.Router();

router.post('/', (req, res, next) => {
    res.status(200).json({status: 'OK'})
})

router.post('/1', (req, res, next) => {
    res.status(200).json({status: 'OK1'})
})

module.exports = router;