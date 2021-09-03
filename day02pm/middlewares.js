const convertToNumbers = (req, resp, next) => {
		req.body.gid = parseInt(req.body.gid)
		req.body.year = parseInt(req.body.year)
		req.body.ranking = parseInt(req.body.ranking)
		next()
	}

module.exports = { convertToNumbers }