const { Pool } = require('pg')
require('dotenv').config()
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PW,
    port: 5432,
})


const query = (text, params, callback) => {
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
        if (err) {
            console.log("pg returned an error", err.code);
            throw "query error";
        }
        const duration = Date.now() - start
        if (callback) {
            console.log('executed query', { text, duration, rows: res.rowCount })
            callback(err, res)
        }
    })
}

// helper function, executes db query w/callback to return clean results
const asyncQuery = async (queryString, clean) => {
    return new Promise((resolve, reject) =>
        query(queryString, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(clean(results))
            }
        }));
}

module.exports = { asyncQuery }