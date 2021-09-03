const index = function(req, resp) {
    resp
        .status(200)
        .type('text/html')
        .send(`<h2><code>hello, world ${new Date()}</code></h2>`)
}

const randomGreetings = function(req, resp) {

}

module.exports = { index, randomGreetings }