var express = require('express')

var router = express.Router()
const { logout } = require('../controller/patient')
const utility = require('../middleware/loginCheck')
const passport = require('passport')
require('../config/passport')(passport)

router.get('/login', function (req, res, next) {
    try{
        res.render('login.hbs', { title: 'Login' })
    }catch (err) {
        res.status(400)
        res.send('error happens when render login page')
    }
})

router.get('/loginForm', utility.unLoggedIn, function (req, res, next) {
    try{
    // console.log(req.session)
        res.render('loginForm.hbs', req.session.flash)
    }catch (err) {
        res.status(400)
        res.send('error happens when render loginform page')
    }
})

router.post(
    '/loginForm',
    utility.unLoggedIn,
    passport.authenticate('patient-login', {
        successRedirect: '/general/dashboard',
        failureRedirect: '/general/loginForm',
        failureflash: true,
    })
)

router.post('/logout', utility.isLoggedIn, logout)

router.get('/dashboard', utility.isLoggedIn, function (req, res, next) {
    try{
        res.render('dashboard.hbs', { title: 'Dashboard' })
    } catch (err) {
        res.status(400)
        res.send('error happens when render dashboard')
    }
})

router.get('/diabetes', function (req, res, next) {
    try{
        res.render('diabetes.hbs', { title: 'Diabetes' })
    } catch (err) {
        res.status(400)
        res.send('error happens when render diabetes page')
    }
})

router.get('/website', function (req, res, next) {
    try{
        res.render('website.hbs', { title: 'Website' })
    }catch (err) {
        res.status(400)
        res.send('error happens when render website page')
    }
})

module.exports = router
