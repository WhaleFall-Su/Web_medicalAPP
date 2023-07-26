var express = require('express')
var router = express.Router()
const {
    isStepLow,
    isStepHigh,
    isBloodHigh,
    isBloodLow,
    isInsulinHigh,
    isInsulinLow,
    isWeightHigh,
    isWeightLow,
    displayRecord,
} = require('../controller/clinicianDash')

const Clinician = require('../db/models/clinician')
const Patient = require('../db/models/patient')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const controller = require('../static/javascripts/usersController.js')
const { logout } = require('../controller/patient')
const utility = require('../middleware/loginCheck')
const passport = require('passport')
const { renderRecordData, addRecord } = require('../controller/recordData')
require('../config/passport')(passport)

let regEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
let regBirth = /^\d{4}\/\d{2}\/\d{2}$/
let regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$/

router.post('/clinicianLogout', utility.isClinicianLoggedIn, logout)

router.get('/clinicianLogin', function(req, res, next) {
    try {
        res.render('clinicianLogin.hbs', { title: 'Clinician Login' })
    } catch (err) {
        res.status(400)
        res.send('error happens when render clinician login page')
    }
})

router.get('/clinicianLoginForm', function(req, res, next) {
    try {
        res.render('clinicianLoginForm.hbs', req.session.flash)
    } catch (err) {
        res.status(400)
        res.send('error happens when render clinician loginForm page')
    }
})


router.post(
    '/clinicianLoginForm',
    utility.clinicianUnLoggedIn,
    passport.authenticate('clinician-login', {
        successRedirect: '/general/clinicianDashboard',
        failureRedirect: '/general/clinicianLoginForm',
        failureflash: true,
    })
)

router.get(
    '/clinicianDashboard',
    utility.isClinicianLoggedIn,
    async function(req, res, next) {
        try {
            let myDate = new Date().toLocaleString('en-Au', {
                timeZone: 'Australia/Melbourne',
            })
            myDate = controller.defaultDateType(myDate)

            let dataArr = []

            let clinician = await Clinician.findById(req.user._id)

            for(let j = 0; j < clinician.patients.length; j++){
                let findData = await renderRecordData(myDate, clinician.patients[j]._id)

                if (findData === null){

                    await addRecord(myDate, clinician.patients[j]._id);
                }
            }

            const record = await displayRecord(myDate)

            for (let i = 0; i < record.length; i++) {
                let patient = await Patient.findById(record[i].patientId)

                if (patient && ((patient.clinicianId).toString() === (req.user._id).toString())) {
                    let data = {
                        id: record[i].patientId,
                        realname: patient.realname,
                        bloodEnter: patient.timeSeries.bloodEnter,
                        weightEnter:patient.timeSeries.weightEnter,
                        insulinEnter:patient.timeSeries.insulinEnter,
                        stepEnter:patient.timeSeries.exerciseEnter,
                        blood: {
                            num: record[i].healthy.blood,
                            isLow: isBloodLow(
                                record[i].healthy.blood,
                                patient.lower.blood
                            ),
                            isHigh: isBloodHigh(
                                record[i].healthy.blood,
                                patient.upper.blood
                            ),
                        },
                        weight: {
                            num: record[i].healthy.weight,
                            isLow: isWeightLow(
                                record[i].healthy.weight,
                                patient.lower.weight
                            ),
                            isHigh: isWeightHigh(
                                record[i].healthy.weight,
                                patient.upper.weight
                            ),
                        },
                        insulin: {
                            num: record[i].healthy.insulin,
                            isLow: isInsulinLow(
                                record[i].healthy.insulin,
                                patient.lower.insulin
                            ),
                            isHight: isInsulinHigh(
                                record[i].healthy.insulin,
                                patient.upper.insulin
                            ),
                        },
                        step: {
                            num: record[i].healthy.exercise,
                            isLow: isStepLow(
                                record[i].healthy.exercise,
                                patient.lower.step
                            ),
                            isHigh: isStepHigh(
                                record[i].healthy.exercise,
                                patient.upper.step
                            ),
                        },
                    }
                    dataArr[i] = data
                }
            }

            res.render('clinicianDashboard.hbs', {
                title: 'Dashboard',
                dashboardData: dataArr,
            })
        } catch (err) {
            console.log(err)
            res.status(400)
            res.send('error happens when render clinicianDashboard')
        }
    }
)

router.get(
    '/clinicianNote/:id',
    utility.isClinicianLoggedIn,
    async function(req, res, next) {
        try {
            const patient = await Patient.findById(req.params.id)
            if (!patient) {
                res.json(new ErrorModel('patient not found'))
                return
            }
            res.render('clinicianNote.hbs', {
                title: 'Note',
                data: patient.notes.map(note => ({ note: note })) || [],
                patientId: patient._id
            })
        } catch (err) {
            res.status(400)
            res.send('error happens when render clinicianNote')
        }
    }
)

router.post(
    '/clinicianNote/:id',
    utility.isClinicianLoggedIn,
    async function(req, res, next) {
        try {
            let notes = req.body

            let noteKeys = Object.keys(notes)

            const patient = await Patient.findById(req.params.id)
            if (!patient) {
                res.json(new ErrorModel('patient not found'))
                return
            }

            for (let i = 0;i<noteKeys.length;i++) {

                (patient.notes).push(notes[noteKeys[i]])
            }

            await patient.save()

            res.redirect('/general/clinicianNote/' + req.params.id)
        } catch (err) {
            res.status(400)
            res.send('error happens when add clinicianNote')
        }
    }
)

/*/!* GET home page. *!/
router.get('/home', function(req, res, next) {
    res.render('home.hbs', { title: 'Home' })
})*/

router.get('/clinicianRegister', function(req, res, next) {
    try {
        res.render('clinicianRegister.hbs', { title: 'Clinician Register' })
    } catch (err) {
        res.status(400)
        res.send('error happens when render clinician register page')
    }
})

router.post('/clinicianRegister', async function(req, res, next) {
    try {
        const {
            firstname,
            lastname,
            username,
            email,
            password,
            confirmpassword,
            displayname,
            birth,
            code,
            briefTextBio
        } = req.body


        const duplicatedEmail = await Clinician.findOne({ email: email.toLowerCase() })
        const duplicatedDisplayName = await Clinician.findOne({ displayname: displayname })


        if (!firstname) {
            res.json(new ErrorModel('firstname not enter'))
            return
        } else if (!lastname) {
            res.json(new ErrorModel('lastname not enter'))
            return
        } else if (!email) {
            res.json(new ErrorModel('email not enter'))
            return
        } else if (!regEmail.test(email)) {
            res.json(new ErrorModel('email not in correct format'))
            return
        } else if (!(password === confirmpassword)) {
            res.json(new ErrorModel('password not match'))
            return
        } else if (!displayname) {
            res.json(new ErrorModel('display name not enter'))
            return
        } else if (!regBirth.test(req.body.birth)) {
            res.json(new ErrorModel('the format of birth date not correct'))
            return
        } else if (password.length < 6) {
            res.json(new ErrorModel('password length must be at least 6'))
            return
        } else if (duplicatedEmail) {
            res.json(new ErrorModel('email already exist'))
            return
        } else if (!regPassword.test(password)) {
            res.json(new ErrorModel('password not in correct format, it must contain numbers and letters'))
            return
        } else if (duplicatedDisplayName) {
            res.json(new ErrorModel('this display name has been used'))
            return
        } else if (displayname.length > 8) {
            res.json(new ErrorModel('the length of display name no more than 8'))
            return
        }



        const clinician = new Clinician({
            firstname,
            lastname,
            email: email.toLowerCase(),
            username,
            password: password,
            displayname,
            birth,
            briefTextBio
        })

        await clinician.save()
        //res.redirect('/general/clinicianLogin')
        let msg = {
            errno: 1,
            message: 'Registration failed',
        }
        res.json(msg)
    } catch (err) {
        res.status(400)
        res.send('error happens when register clinician')
    }

})

router.get(
    '/clinicianRegisterPatient',
    utility.isClinicianLoggedIn,
    function(req, res, next) {
        try {
            res.render('clinicianRegisterPatient.hbs', {
                title: 'Clinician Register Patient',
            })
        } catch (err) {
            res.status(400)
            res.send('error happens when render clinicianRegisterPatient page')
        }
    }
)

router.post(
    '/clinicianRegisterPatient',
    utility.isClinicianLoggedIn,
    async function(req, res, next) {
        try {
            let clinicianId = req.user._id
            const {
                firstname,
                lastname,
                email,
                password,
                confirmpassword,
                displayname,
                birth,
                address,
                code,
                briefTextBio
            } = req.body


            const duplicatedDisplayName = await Patient.findOne({ username: displayname })
            const duplicatedEmail = await Patient.findOne({ email: email.toLowerCase() })


            if (!firstname) {
                res.json(new ErrorModel('firstname not enter'))
                return
            } else if (!lastname) {
                res.json(new ErrorModel('lastname not enter'))
                return
            } else if (!email) {
                res.json(new ErrorModel('email not enter'))
                return
            } else if (!regEmail.test(email)) {
                res.json(new ErrorModel('email not in correct format'))
                return
            } else if (duplicatedEmail) {
                res.json(new ErrorModel('email already exist'))
                return
            } else if (!(password === confirmpassword)) {
                res.json(new ErrorModel('password not match'))
                return
            } else if (!displayname) {
                res.json(new ErrorModel('display name not enter'))
                return
            } else if (!regBirth.test(req.body.birth)) {
                res.json(new ErrorModel('the format of birth date not correct'))
                return
            } else if (password.length < 6) {
                res.json(new ErrorModel('password length must be at least 6'))
                return
            } else if (!regPassword.test(password)) {
                res.json(new ErrorModel('password not in correct format, it must contain numbers and letters'))
                return
            } else if (duplicatedDisplayName) {
                res.json(new ErrorModel('this display name has been used'))
                return
            } else if (displayname.length > 8) {
                res.json(new ErrorModel('the length of display name no more than 8'))
                return
            }


            const patient = new Patient({
                firstname,
                lastname,
                email: email.toLowerCase(),
                realname: `${firstname} ${lastname}`,
                password: password,
                username: displayname,
                dateofBirth: birth,
                patientcomment: '',
                records: [],
                registerTime: new Date().toISOString().split('T')[0],
                clinicianId,
                address: address,
                briefTextBio
            })

            let patients = req.user.patients
            patients.push(patient._id)

            await Clinician.findOneAndUpdate(
                {
                    _id: clinicianId,
                },
                {
                    patients
                },
                { new: true }
            )

            await patient.save()
            // initialize a record for this new patient
            let myDate = new Date().toLocaleString('en-Au', {
                timeZone: 'Australia/Melbourne',
            })
            myDate = controller.defaultDateType(myDate)

            const addData = await addRecord(myDate, patient._id)

            let msg = {
                errno: 1,
                message: 'Registration failed',
            }
            res.json(msg)
        } catch (err) {
            res.status(400)
            res.send('error happens when register patient')
        }
    }
)

router.get(
    '/clinicianProfile',
    utility.isClinicianLoggedIn,
    async function(req, res, next) {
        try {
            const clinicianId = req.user._id
            const clinician = await Clinician.findById(clinicianId)
            res.render('clinicianProfile.hbs', {
                title: 'Profile',
                data: {
                    firstname: clinician.firstname,
                    lastname: clinician.lastname,
                    email: clinician.email,
                    briefTextBio: clinician.briefTextBio,
                    birth: clinician.birth,
                },
            })
        } catch (err) {
            res.status(400)
            res.send('error happens when render clinician profile')
        }
    }
)

router.get(
    '/clinicianReset',
    utility.isClinicianLoggedIn,
    function(req, res, next) {
        try {
            res.render('clinicianReset.hbs', { title: 'Reset Password' })
        } catch (err) {
            res.status(400)
            res.send('error happens when render clinicianReset page')
        }
    }
)

router.post(
    '/clinicianReset',
    utility.isClinicianLoggedIn,
    async function(req, res, next) {
        try {
            const { new_password, confirm_password, cur_password } = req.body
            const clinician = await Clinician.findById(req.user._id)
            if (!clinician) {
                res.json(new ErrorModel('user not found'))
                return
            }
            if (!await require('bcrypt').compare(cur_password, clinician.password)) {
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

            clinician.password = new_password

            await clinician.save()

            logout(req,res)
        } catch (err) {
            res.status(400)
            res.send('error happens when reset password')
        }
    }
)

router.get(
    '/clinicianComments',
    utility.isClinicianLoggedIn,
    async function(req, res, next) {
        try {
            let dataArr = []
            let patients = req.user.patients
            for (let i = 0;i<patients.length;i++) {
                let patientId = patients[i]._id
                let patient = await Patient.findById(patientId)
                let data = {
                    name: patient.realname,
                    comment: patient.patientcomment,
                    patientId: patients[i]._id
                }
                dataArr[i] = data
            }


            res.render('clinicianComments.hbs', {
                title: 'Comments',
                data: dataArr,
            })
        } catch (err) {
            res.status(400)
            res.send('error happens when render clinicianComments')
        }
    }
)

const TYPES = [
    'Blood glucose level(nmol/L)',
    'Weight(kg)',
    'Insulin taken(dose)',
    'Step count',
]
const MAP_TIME = {
    'Blood glucose level(nmol/L)': 'bloodEnter',
    'Weight(kg)': 'weightEnter',
    'Insulin taken(dose)': 'insulinEnter',
    'Step count': 'exerciseEnter',
}
const MAP_TYPE = {
    'Blood glucose level(nmol/L)': 'blood',
    'Weight(kg)': 'weight',
    'Insulin taken(dose)': 'insulin',
    'Step count': 'exercise',
}

// view data page
let myDate = new Date().toLocaleString('en-Au', {
    timeZone: 'Australia/Melbourne',
})
myDate = controller.defaultDateType(myDate)


let healthyStartDate = controller.otherDay(myDate, 1 - new Date(myDate).getDay())
let healthyEndDate = controller.otherDay(myDate, 7 - new Date(myDate).getDay())
router.get(
    '/clinicianDetail/:id',
    utility.isClinicianLoggedIn,
    async function(req, res, next) {
        try {
            const patient = await Patient.findById(req.params.id)
            // console.log(patient)
            const patientId = patient._id
            let data = {
                id: patient._id,
                name: patient.realname,
                bloods: TYPES,
                message: patient.supportMsg,
                headlthy: {
                    times: ['Year', 'Month', 'Week'],
                    healthyTypes: TYPES,
                },
            }
            req.session.blood = req.session.blood || data.bloods[0]
            req.session.time = req.session.time || data.headlthy.times[2]
            req.session.healthyType =
                req.session.healthyType || data.headlthy.healthyTypes[0]

            let dataType = [
                'Blood glucose level(nmol/L)',
                'Weight(kg)',
                'Dose of Insulin Taken (dose)',
                'Exercise (Steps)',
            ]

            req.session.healthyType = req.session.healthyType
                ? req.session.healthyType
                : dataType[1]


            let healthyYData = []

            switch (req.session.healthyType) {
                case 'Blood glucose level(nmol/L)':
                    for (let i = 0; i < 7; i++) {
                        let date = controller.otherDay(healthyStartDate, i)
                        // console.log(date)
                        let record = await renderRecordData(date, patientId)
                        if (record) {
                            healthyYData.push(record.healthy.blood)
                        } else {
                            healthyYData.push(null)
                        }
                    }
                    break
                case 'Weight(kg)':
                    for (let i = 0; i < 7; i++) {
                        let date = controller.otherDay(healthyStartDate, i)
                        let record = await renderRecordData(date, patientId)
                        if (record) {
                            healthyYData.push(record.healthy.weight)
                        } else {
                            healthyYData.push(null)
                        }
                    }
                    break
                case 'Insulin taken(dose)':
                    for (let i = 0; i < 7; i++) {
                        let date = controller.otherDay(healthyStartDate, i)
                        let record = await renderRecordData(date, patientId)
                        if (record) {
                            healthyYData.push(record.healthy.insulin)
                        } else {
                            healthyYData.push(null)
                        }
                    }
                    break
                case 'Step count':
                    for (let i = 0; i < 7; i++) {
                        // console.log("healthyStartDate is ", healthyStartDate)
                        let date = controller.otherDay(healthyStartDate, i)
                        // console.log(date)
                        let record = await renderRecordData(date, patientId)
                        if (record) {
                            healthyYData.push(record.healthy.exercise)
                        } else {
                            healthyYData.push(null)
                        }
                    }
                    break
                default:
                    for (let i = 0; i < 7; i++) {
                        healthyYData.push(null)
                    }
                    break
            }

            let data2 = {
                healthyYData: healthyYData,

                healthyXData:
                    req.session.time == 'Week'
                        ? ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
                        : ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
            }

            res.render('clinicianDetail.hbs', {
                title: 'Detail',
                id: patient._id,
                name: patient.realname,
                bloods: TYPES,
                message: patient.supportMsg,
                headlthy: data.headlthy,
                uppers: ['N/A'],
                lowers: ['N/A'],
                clinicianDetailStartDateString: healthyStartDate,
                clinicianDetailEndDateString: healthyEndDate,
                healthyYData: data2.healthyYData,
                healthyXData: data2.healthyXData,
                checkBlood: req.session.blood,
                checkUpper:
                    patient.upper[MAP_TYPE[req.session.blood]] == 0
                        ? 'N/A'
                        : patient.upper[MAP_TYPE[req.session.blood]],
                checkLower:
                    patient.lower[MAP_TYPE[req.session.blood]] == 0
                        ? 'N/A'
                        : patient.lower[MAP_TYPE[req.session.blood]],
                checkTime: req.session.time,
                checkHealthyType: req.session.healthyType,
            })
        } catch (err) {
            res.status(400)
            res.send('error happens when render clinicianDetail page')
        }
    }
)

//choose datatype to set upper and lower
router.post('/clinicianDetail/blood', function(req, res, next) {
    try{
        req.session.blood = req.body.blood
        req.session.upper = ''
        req.session.lower = ''
        // res.redirect('/general/clinicianDetail')
        res.json(new SuccessModel())
    }catch (err) {
        res.status(400)
        res.send('error happens when set datatype')
    }
})

router.post('/clinicianDetail/blood/:id', function(req, res, next) {
    try{
        req.session.blood = req.body.blood
        // res.redirect('/general/clinicianDetail/' + req.params.id)
        res.json(new SuccessModel())
    }catch (err) {
        res.status(400)
        res.send('error happens when get data')
    }
})

//choose time
router.post('/clinicianDetail/time/:id', function(req, res, next) {
    try{
        req.session.time = req.body.time
        res.redirect('/general/clinicianDetail/' + req.params.id)
    }catch (err) {
        res.status(400)
        res.send('error happens when choose time')
    }
})
//choose datatype the graph shows
router.post('/clinicianDetail/healthyType', function(req, res, next) {
    try{
        req.session.healthyType = req.body.healthyType
        // res.redirect('/general/clinicianDetail/' + req.params.id)
        res.json(new SuccessModel())
    }catch (err) {
        res.status(400)
        res.send('error happens when set datatype to show graph')
    }
})
router.post('/clinicianDetail/message/:id', async function(req, res, next) {
    try{
        // save req.body.message
        await Patient.findByIdAndUpdate(req.params.id, {
            supportMsg: req.body.message,
        })
        res.redirect('/general/clinicianDetail/' + req.params.id)
    }catch (err) {
        res.status(400)
        res.send('error happens when get support message')
    }
})

router.post('/clinicianDetail/left/:id', function(req, res, next) {
    try{
        healthyStartDate = controller.otherDay(healthyStartDate, -7)
        healthyEndDate = controller.otherDay(healthyEndDate, -7)
        res.redirect('/general/clinicianDetail/' + req.params.id)
    }catch (err) {
        res.status(400)
        res.send('error happens when roll back date')
    }
})
router.post('/clinicianDetail/right/:id', function(req, res, next) {
    try{
        healthyStartDate = controller.otherDay(healthyStartDate, 7)
        healthyEndDate = controller.otherDay(healthyEndDate, 7)
        res.redirect('/general/clinicianDetail/' + req.params.id)
    } catch (err) {
        res.status(400)
        res.send('error happens when move date forward')
    }
})

router.post('/clinicianDetail/datatype/:id', async function(req, res, next) {
    try{
        let patient = await Patient.findById(req.params.id)
        const { upper, lower } = req.body

        if (upper == 'N/A' && lower == 'N/A') {
            patient.timeSeries[MAP_TIME[req.session.blood]] = false
            patient.upper[MAP_TYPE[req.session.blood]] = 0
            patient.lower[MAP_TYPE[req.session.blood]] = 0
        } else {
            patient.timeSeries[MAP_TIME[req.session.blood]] = true
            patient.upper[MAP_TYPE[req.session.blood]] = upper == 'N/A' ? 0 : upper
            patient.lower[MAP_TYPE[req.session.blood]] = lower == 'N/A' ? 0 : lower
        }

        await patient.save()
        // res.redirect('/general/clinicianDetail/' + req.params.id)
        res.json(new SuccessModel())
    }catch (err) {
        res.status(400)
        res.send('error happens when get datatype')
    }
})
module.exports = router
