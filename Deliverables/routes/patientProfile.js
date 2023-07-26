var express = require('express')
var router = express.Router()
const utility = require('../middleware/loginCheck')
const Patient = require('../db/models/patient')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { logout } = require('../controller/patient')

router.get('/profile', function (req, res, next) {
    try {
        res.render('profile.hbs', {
            title: req.user.title,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            name: req.user.realname,
            email: req.user.email,
            briefTextBio: req.user.briefTextBio,
            address: req.user.address,
            birth: req.user.dateofBirth,
        })
    } catch (e) {
        res.status(400)
        res.send('error happens when render profile page')
    }
})

router.get(
    '/resetPassword',
    utility.isLoggedIn,
    function(req, res, next) {
        try {
            res.render('resetPassword.hbs', { title: 'Reset Password' })
        } catch (e) {
            res.status(400)
            res.send('error happens when render resetPassword page')
        }
    }
)

router.post(
    '/resetPassword',
    utility.isLoggedIn,
    async function(req, res, next) {
        try {
            const { new_password, confirm_password, cur_password } = req.body
            const patient = await Patient.findById(req.user._id)

            let regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$/
            if (!patient) {
                res.json(new ErrorModel('user not found'))
                return
            }

            if (!await require('bcrypt').compare(cur_password, patient.password)) {
                res.json(new ErrorModel('current password not match'))
                return
            }
            if (new_password !== confirm_password) {
                res.json(new ErrorModel('password not match'))
                return
            }
            // password length 6
            if (new_password.length < 6) {
                res.json(new ErrorModel('password length must be at least 6'))
                return
            }

            if (!regPassword.test(new_password)) {
                res.json(new ErrorModel('password not in correct format, it must contain numbers and letters'))
                return
            }


            patient.password = new_password
            await patient.save()
            logout(req,res)
        } catch (e) {
            res.status(400)
            res.send('error happens when reset Password')
        }
    }
)

module.exports = router
