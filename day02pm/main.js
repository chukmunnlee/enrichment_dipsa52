// load libraries
const morgan = require('morgan')
const express = require('express')
const hbs = require('express-handlebars')
const { MongoClient } = require('mongodb')

const { convertToNumbers } = require('./middlewares')

// constants
const BGG_DB = 'bgg'
const GAME = 'game'

// configure app 
const PORT = parseInt(process.env.PORT) || 3000

// Setup mongo client
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const client = new MongoClient(MONGO_URL);

// create an instance of express
const app = express()

app.engine('hbs', hbs({ defaultLayout: false}))
app.set('view engine', 'hbs')

// configure routes
app.use(morgan('common'))

app.get('/search', async (req, resp) => {
	const q = req.query['q'];
	try {
		// db.game.find({ name: { $regex: 'search string', $options: 'i' }})
		const result = await client.db(BGG_DB)
			.collection(GAME)
			.find({
				name: { $regex: q, $options: 'i' }
			}) 
			.toArray();
		resp.status(200).type('text/html')
		resp.render('games', { q, game: result })
	} catch (e) {
		resp.status(500).type('text/plain')
		resp.send(JSON.stringify(e))
	}
})

//app.use(express.urlencoded({ extended: true }))
app.post('/game', 
	express.urlencoded({ extended: true }),
	convertToNumbers,
	async(req, resp) => {
		try {
			const result = await client.db(BGG_DB)
				.collection(GAME)
				.insertOne(req.body)
			console.info('>>> after insert result: ', result)
			resp.status(201).type('text/plain').send('Added game to database')
		} catch(e) {
			resp.status(500).type('text/plain')
			resp.send(JSON.stringify(e))
		}
	}
)

app.use(express.static(__dirname + '/static'))

// start application
client.connect()
	.then(() => {
		app.listen(PORT, () => {
			console.info(`Application started on port ${PORT} at ${new Date()}`)
		})
	})
	.catch(error => {
			console.error(error)
			process.exit(0)
	})