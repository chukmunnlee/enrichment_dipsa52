// load libraries
const morgan = require('morgan')
const express = require('express')
const hbs = require('express-handlebars')
const mysql = require('mysql2/promise')

const { index, randomGreetings } = require('./handlers')

// SQL query
// Prepared statement - parameterized SQL statement
const SELECT_GAME_BY_NAME = 'select * from game where name like ? limit ? offset ?';

// configure the libraries and the 
const PORT = parseInt(process.env.PORT) || 3000

// create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'betty',
    password: process.env.DB_PASSWORD || 'betty',
    database: process.env.DB_NAME || 'bgg',
    connectionLimit: 4,
})

// create an instance of express app
const app = express()

app.engine('hbs', hbs({ defaultLayout: false}))
app.set('view engine', 'hbs')

// configure routes
app.get('/search', (req, resp) => {

    // Get the query string
    const q = req.query['q'];
    const limit = 20 // you should get this from the querysting
    const offset = 0

    // check if we have q
    if (!q) {
        resp.status(400).type('text/plain')
        resp.send('Please enter boardgame name to search')
        return
    }

    pool.getConnection()
        .then(conn =>{
            const p0 = conn.query(SELECT_GAME_BY_NAME, [ `%${q}%`, limit, offset ])
            const p1 = Promise.resolve(conn); // Wrap conn in a promise and resolve it immediately
            return Promise.all([ p0, p1 ]) // returns a promise of any array 
        })
        .then(result => {
            // result -> array 2 elements 0 - SQL, 1 - conn
            const game = result[0][0] // results
            const conn = result[1]

            // release the connection back into the pool
            conn.release();

            resp.status(200).type('text/html')
            resp.render('games', { q, game })
        })
        .catch(error => {
            // handle the error
            resp.status(500).type('text/plain')
            resp.send(JSON.stringify(error))
        })
})

// Load static resources
app.use(express.static(__dirname + '/static'))

// start the server
pool.getConnection()
    .then(conn => Promise.all([ Promise.resolve(conn), conn.ping() ]))
    .then(result => {
        result[0].release()
        app.listen(PORT, () => {
            console.info(`Application started on port ${PORT} on ${new Date()}`)
        })
    })
    .catch(error => {
        console.error('Cannot start application: ', error)
        process.exit(0)
    })