var express = require('express')
var router = express.Router()
const controller = require('../static/javascripts/usersController.js')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const {
    renderRecordData,
    addRecord,
    updateRecord,
    updateComment,
} = require('../controller/recordData')
const utility = require('../middleware/loginCheck')

// Set to Melbourne time
let myDate = new Date().toLocaleString('en-Au', {
    timeZone: 'Australia/Melbourne',
})
myDate = controller.defaultDateType(myDate)

// Set to today time
let today = new Date().toLocaleString('en-Au', {
    timeZone: 'Australia/Melbourne',
})
today =controller.defaultDateType(today)

router.get('/record', utility.isLoggedIn, async (req, res, next) => {
    try {
        // the users can see the records of today when they logged in each time
        if (req.session.logNum === 0) {
            myDate = today
            req.session.logNum += 1
        }

        let patientId = req.user._id

        //display record page
        const data = await renderRecordData(myDate, patientId)

        if (data) {
            res.render('record.hbs', {
                title: 'Record',
                dateString: controller.toDateString(myDate),
                healthy: data.healthy,
                allRate: (data.allRate * 100).toFixed(2) + '%',
                isShowBadge: data.allRate >= 0.8 ? true : false,
                comment: data.comment,
                updatedData: data.updatedData
            })
            return
        }

        // if not found in mongodb, it will create a new database
        const addData = await addRecord(myDate, patientId)
        res.redirect('/general/record')
    } catch (err) {
        res.status(400)
        res.send('error happens when render record data')
    }
})

//update record data
router.post('/record/submitBlood', async (req, res, next) => {
    try{
        let patientId = req.user._id
        let params = {
            bloodEnter: req.user.timeSeries.bloodEnter,
            weightEnter: req.user.timeSeries.weightEnter,
            insulinEnter: req.user.timeSeries.insulinEnter,
            exerciseEnter: req.user.timeSeries.exerciseEnter,
        }
        params = Object.assign(params, req.body)

        // identify whether is number
        let regPos = /^[0-9]+.?[0-9]*/

        if (params.bloodEnter && !params.blood) {
            res.json(new ErrorModel('Blood glucose level must enter'))
            return
        }  else if (params.bloodEnter && !regPos.test(params.blood)) {
            res.json(new ErrorModel('Blood glucose level must enter in number'))
            return
        } else if (!params.bloodEnter && params.blood) {
            res.json(new ErrorModel('Blood glucose level do not enter'))
            return
        } else if (myDate !== today) {
            res.json(new ErrorModel('You can not submit the healthy data since the deadline was missed'))
            return
        }


        const val = await updateRecord(patientId, params, myDate)
        if (val) {
            res.json(new SuccessModel('update success'))
        } else {
            res.json(new ErrorModel('update fair'))
        }
    }catch (err) {
        res.status(400)
        res.send('error happens when submit blood glucose')
    }
})

router.post('/record/submitWeight', async (req, res, next) => {
    try{
        let patientId = req.user._id
        let params = {
            bloodEnter: req.user.timeSeries.bloodEnter,
            weightEnter: req.user.timeSeries.weightEnter,
            insulinEnter: req.user.timeSeries.insulinEnter,
            exerciseEnter: req.user.timeSeries.exerciseEnter,
        }
        params = Object.assign(params, req.body)

        // identify whether is number
        let regPos = /^[0-9]+.?[0-9]*/


        if (params.weightEnter && !params.weight) {
            res.json(new ErrorModel('Weight must enter'))
            return
        } else if (params.weightEnter && !regPos.test(parseFloat(params.weight))) {
            res.json(new ErrorModel('Weight must enter in number'))
            return
        } else if (!params.weightEnter && params.weight) {
            res.json(new ErrorModel('Weight do not enter'))
            return
        } else if (myDate !== today) {
            res.json(new ErrorModel('You can not submit the healthy data since the deadline was missed'))
            return
        }


        const val = await updateRecord(patientId, params, myDate)
        if (val) {
            res.json(new SuccessModel('update success'))
        } else {
            res.json(new ErrorModel('update fair'))
        }
    }catch (err) {
        res.status(400)
        res.send('error happens when submit weight')
    }
})

router.post('/record/submitInsulin', async (req, res, next) => {
    try{
        let patientId = req.user._id
        let params = {
            bloodEnter: req.user.timeSeries.bloodEnter,
            weightEnter: req.user.timeSeries.weightEnter,
            insulinEnter: req.user.timeSeries.insulinEnter,
            exerciseEnter: req.user.timeSeries.exerciseEnter,
        }
        params = Object.assign(params, req.body)

        // identify whether is number
        let regPos = /^[0-9]+.?[0-9]*/


        if (params.insulinEnter && !params.insulin) {
            res.json(new ErrorModel('Dose of insulin taken must enter'))
            return
        } else if (
            params.insulinEnter &&
            !regPos.test(parseFloat(params.insulin))
        ) {
            res.json(new ErrorModel('Dose of insulin taken must enter in number'))
            return
        } else if (!params.insulinEnter && params.insulin) {
            res.json(new ErrorModel('Dose of insulin taken do not enter'))
            return
        } else if (myDate !== today) {
            res.json(new ErrorModel('You can not submit the healthy data since the deadline was missed'))
            return
        }


        const val = await updateRecord(patientId, params, myDate)
        if (val) {
            res.json(new SuccessModel('update success'))
        } else {
            res.json(new ErrorModel('update fair'))
        }
    }catch (err) {
        res.status(400)
        res.send('error happens when submit insulin')
    }
})


router.post('/record/submitExercise', async (req, res, next) => {
    try{
        let patientId = req.user._id
        let params = {
            bloodEnter: req.user.timeSeries.bloodEnter,
            weightEnter: req.user.timeSeries.weightEnter,
            insulinEnter: req.user.timeSeries.insulinEnter,
            exerciseEnter: req.user.timeSeries.exerciseEnter,
        }
        params = Object.assign(params, req.body)

        // identify whether is number
        let regPos = /^[0-9]+.?[0-9]*/

        if (params.exerciseEnter && !params.exercise) {
            res.json(new ErrorModel('Exercise must enter'))
            return
        } else if (params.exerciseEnter && !regPos.test(params.exercise)) {
            res.json(new ErrorModel('Exercise must enter in number'))
            return
        } else if (!params.exerciseEnter && params.exercise) {
            res.json(new ErrorModel('Exercise do not enter'))
            return
        } else if (myDate !== today) {
            res.json(new ErrorModel('You can not submit the healthy data since the deadline was missed'))
            return
        }

        const val = await updateRecord(patientId, params, myDate)
        if (val) {
            res.json(new SuccessModel('update success'))
        } else {
            res.json(new ErrorModel('update fair'))
        }
    }catch (err) {
        res.status(400)
        res.send('error happens when submit exercise')
    }
})



// update patients' comment
router.post('/record/add', async (req, res, next) => {
    try {
        let patientId = req.user._id
        await updateComment(patientId, req.body, myDate)
        res.redirect('/general/record')
    } catch (e) {
        res.status(400)
        res.send('error happens when update record comment')
    }
})

// get the record data of previous day
router.post('/record/left', async (req, res, next) => {
    try {
        const registerTime = req.user.registerTime

        if (myDate > registerTime) {
            myDate = controller.otherDay(myDate, -1)
        }
        res.redirect('/general/record')

    } catch (e) {
        res.status(400)
        res.send('error happens when look at the record in previous day')
    }
})

// get the record data of next day
router.post('/record/right', async (req, res, next) => {
    try {
        let today = new Date().toLocaleString('en-Au', {
            timeZone: 'Australia/Melbourne',
        })
        today = controller.defaultDateType(today)

        if (myDate < today) {
            myDate = controller.otherDay(myDate, 1)
        }
        res.redirect('/general/record')
    } catch (e) {
        res.status(400)
        res.send('error happens when look at the record in next day')
    }
})

module.exports = router
