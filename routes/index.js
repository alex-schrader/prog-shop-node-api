// ./routes/index.js
const categories = require('./categories')
const extension = require('./extension')
const brand = require('./brand')

module.exports = app => {
    app.use('/category', categories)
    app.use('/extension', extension)
    app.use('/brand', brand)
}