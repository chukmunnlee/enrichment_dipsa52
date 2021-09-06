// load the modules
const morgan = require('morgan')
const express = require('express')
const hbs = require('express-handlebars')

const fetch = require('node-fetch')
const withQuery = require('with-query').default

// configure the application
const GIPHY_URL = 'https://api.giphy.com/v1/gifs/search'
const PORT = parseInt(process.env.PORT) || 3000
const API_KEY = process.env.API_KEY 

// create an instance of express
const app = express()

// configure template engine handlebars
app.engine('hbs', hbs({ defaultLayout: false }))
app.set('view engine', 'hbs')

// add logging
app.use(morgan('common'))

// configure the routes

app.post('/search',
    express.urlencoded({ extended: true }), // to parse the payload
    (req, resp) => {
        // body attribute is create by express.urlencoded middleware
        const payload = req.body; 
        const terms = payload['terms']

        fetch(
            withQuery(GIPHY_URL, { api_key: API_KEY, q: terms, limit: 20 }))
        .then(result => result.json())
        .then(result => {
            const urls = result.data.map(v => v.images.downsized_medium.url)
            const hasResult = urls.length > 0
            resp.status(200).type('text/html')
            resp.render('giphy', { terms, urls, hasResult })
        })
    }
)

app.use(express.static(__dirname + '/static'));

// start the application
if (!!API_KEY)
    app.listen(PORT, () => {
        console.info(`Application started on port ${PORT} at ${new Date()}`)
    })
else {
    console.error('API_KEY not set')
    process.exit(1)
}
