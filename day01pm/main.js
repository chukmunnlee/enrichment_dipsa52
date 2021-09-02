// import modules
const morgan = require('morgan')
const fetch = require('node-fetch')
const handlebars = require('express-handlebars')
const express = require('express')

// configure the module and app
const PORT = parseInt(process.env.PORT) || 3000

// create an instance of the application
const app = express()

// configure app to use handlebars template engine
app.engine('hbs', handlebars({ defaultLayout: false }))
app.set('view engine', 'hbs')


// configure the request handlers
// GET /fortune
app.get('/fortune', (req, resp) => {
    // Make a HTTP call
    // Chain the calls
    fetch('http://yerkee.com/api/fortune') // promise
        .then(result => result.json()) // result.json() returns a promise
        .then(result => {
            resp.status(200).type('text/html')
            resp.render('fortune',  // view
                { fortuneText: result.fortune } // model
            )
        })
        .catch(error => {
            resp.status(500).type('text/plain')
            resp.send(error)
        })
})

app.use(express.static(__dirname + '/static'))

app.use((req, resp) => {
    resp.status(404).type('text/html')
    resp.sendFile(__dirname + '/static/error.html');
})

// start the app
app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)
})