var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/home', function (req, res, next) {
    try {
        res.render('home.hbs', { title: 'Home' })
    } catch (err) {
        res.status(400)
        res.send('error happens when render home page')
    }
})

module.exports = router
