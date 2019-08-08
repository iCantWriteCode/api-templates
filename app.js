const express = require('express')
const app = express()
const port = 9000

// FrontEnd Route
app.get('/', (req, res) => res.send('Hello World!'))

// Endpoint Routes

app.listen(port, () => console.log(`Example app listening on port ${port}!`))