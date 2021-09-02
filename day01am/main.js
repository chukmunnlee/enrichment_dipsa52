// Import - Express, morgan
const morgan = require('morgan')
const express = require('express')

// Configuring the packges
// make the port number configurable - comamnd line, environment variable, fallback to default
const PORT = parseInt(process.env.PORT) || 3000;

// Create an Express app
const app = express();

// Configure the request handlers for Express app
//const m = morgan('combined')
//app.use(m)
app.use(morgan('combined'))

app.get([ '/time.html', '/time' ], (req, resp) => {

    // need to set 2 things when you return a HTTP response
    // status code, content type
    resp.status(200) // set the status code
    resp.type('text/html') // set the content-type
    resp.send(`<h2>The current time is ${new Date()}</h2>`) // send the entity/data
})

app.get('/random', (req, resp) => {

    // Get one or more query parameter
    const count = parseInt(req.query['count']) || 3;
    const start = parseInt(req.query['start']) || 1;
    const end = parseInt(req.query['end']) || 100;

    let result = []
    for (i = 0; i < count; i++)
        result.push(Math.floor(Math.random() * end) + start)

    // Look at Accept
    resp.format({
        'text/html': () => {
            resp.status(200)
            resp.type('text/html') // media type
            resp.send(`<h1>Your lucky numbers are ${result}</h1>`)
        },
        'text/plain': () => {
            resp.status(200)
            resp.type('text/plain') // media type
            resp.send(`Your luck numbers are ${result.reduce((acc, v) => acc + ', ' + v, '')}`)
        },
        'application/json': () => {
            resp.status(200)
            resp.type('application/json') // media type
            resp.json({ luckyNumbers: result })
        },
        default: () => {
            resp.status(406)
            resp.end('')
        }
    })
})

// Serve files from this directory
//const s = express.static(__dirname + '/static')
//app.use(s)
app.use(express.static(__dirname + '/static'))

// Start the Express app
app.listen(PORT, () => {
        console.info(`Application started on port ${PORT} at ${new Date()}`)
    }
)