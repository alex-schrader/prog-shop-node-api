const express = require('express')
const mountRoutes = require('./routes')

const app = express()
const port = 5000

mountRoutes(app)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
