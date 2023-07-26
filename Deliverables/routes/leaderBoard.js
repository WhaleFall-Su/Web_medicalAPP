var express = require('express')
var router = express.Router()
const controller = require('../static/javascripts/usersController.js')
const { getAllPatient, findPatient } = require('../controller/patient')
const { getAllRecord, renderRecordData } = require('../controller/recordData')
const utility = require('../middleware/loginCheck')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// leaderBoard page
router.get('/leaderBoard', utility.isLoggedIn, async (req, res, next) => {
    try {
        let dataArr = []
        let getRate = new Array()
        let topPatient = new Object()
        const allPatient = await getAllPatient()

        // identify whether the patient is the user who has logged
        let isUser = false


        for (let i = 0; i < allPatient.length; i++) {
            // get the engagement rate of each patient
            let allRate = 0
            let patientId = allPatient[i]._id
            const allRecord = await getAllRecord(patientId)

            //得到当前病人最新的all rate
            if (allRecord.length !== 0) {
                let newestTime = allRecord[0].updatedAt
                let newestRecord = allRecord[0]
                for (let j = 0; j < allRecord.length; j++) {
                    if (newestTime < allRecord[j].updatedAt) {
                        newestTime = allRecord[j].updatedAt
                        newestRecord = allRecord[j]
                    }
                }
                allRate = newestRecord.allRate
            }

            getRate[i] = { patientId, allRate}

        }


        const sortedByRate = getRate.sort((a, b) => b.allRate - a.allRate);

        for (let j =0;j<getRate.length;j++) {
            let patientId = getRate[j].patientId

            let isUser = false

            if (patientId.toString() === (req.user._id).toString()) {
                isUser = true
            }

            let data = {
                name: (await findPatient(patientId)).username,
                rate: (getRate[j].allRate * 100).toFixed(2),
                isUser: isUser,
            }
            dataArr[j] = data
        }


        res.render('leaderBoard.hbs', {
            title: 'Leader Board',
            data: dataArr,
        })
    } catch (err) {
        res.status(400)
        res.send('error happens when render leaderBoard')
    }
})

// view data page
let myDate = new Date().toLocaleString('en-Au', {
    timeZone: 'Australia/Melbourne',
})
myDate = controller.defaultDateType(myDate)

let healthyStartDate = controller.otherDay(myDate, 1 - new Date(myDate).getDay())
let healthyEndDate = controller.otherDay(myDate, 7 - new Date(myDate).getDay())

router.get('/healthy', utility.isLoggedIn, async (req, res, next) => {
    try {
        // get all the data according to the healthyStartDate, healthyEndDate and checkType
        let patientId = req.user._id

        // set magic num
        let Mon = 0
        let Tue = 1
        let Wed = 2
        let Thur = 3
        let Fri = 4
        let Sat = 5
        let Sun = 6

        let dataType = [
            'Blood glucose level(nmol/L)',
            'Weight(kg)',
            'Dose of Insulin Taken (dose)',
            'Exercise (Steps)',
        ]

        if (req.session.checkType === null)
        req.session.checkType = req.session.checkType
            ? req.session.checkType
            : dataType[0]
        let healthyYData = []

        switch (req.session.checkType) {
            case 'Blood glucose level(nmol/L)':
                for (let i = 0; i < 7; i++) {
                    let date = controller.otherDay(healthyStartDate, i)
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
            case 'Dose of Insulin Taken (dose)':
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
            case 'Exercise (Steps)':
                for (let i = 0; i < 7; i++) {
                    let date = controller.otherDay(healthyStartDate, i)
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

        let data = {
            weeklyData: [
                {
                    date: controller.toDateString(healthyStartDate),
                    data: healthyYData[Mon],
                },
                {
                    date: controller.toDateString(
                        controller.otherDay(healthyStartDate, Tue)
                    ),
                    data: healthyYData[Tue],
                },
                {
                    date: controller.toDateString(
                        controller.otherDay(healthyStartDate, Wed)
                    ),
                    data: healthyYData[Wed],
                },
                {
                    date: controller.toDateString(
                        controller.otherDay(healthyStartDate, Thur)
                    ),
                    data: healthyYData[Thur],
                },
                {
                    date: controller.toDateString(
                        controller.otherDay(healthyStartDate, Fri)
                    ),
                    data: healthyYData[Fri],
                },
                {
                    date: controller.toDateString(
                        controller.otherDay(healthyStartDate, Sat)
                    ),
                    data: healthyYData[Sat],
                },
                {
                    date: controller.toDateString(healthyEndDate),
                    data: healthyYData[Sun],
                },
            ],
            healthyXData: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
            healthyYData: healthyYData,

            message: req.user.supportMsg,
        }
        res.render('healthy.hbs', {
            title: 'Healthy',
            healthyStartDateString: controller.toDateString(healthyStartDate),
            healthyEndDateString: controller.toDateString(healthyEndDate),
            dataType: [
                'Blood glucose level(nmol/L)',
                'Weight(kg)',
                'Dose of Insulin Taken (dose)',
                'Exercise (Steps)',
            ],
            checkType: req.session.checkType,
            weeklyData: data.weeklyData,
            healthyXData: data.healthyXData,
            healthyYData: data.healthyYData,
            message: data.message,
        })
    } catch (err) {
        res.status(400)
        res.send('error happens when render healthy page')
    }
})

router.post('/healthy/left', function (req, res, next) {
    try {
        healthyStartDate = controller.otherDay(healthyStartDate, -7)
        healthyEndDate = controller.otherDay(healthyEndDate, -7)
        res.redirect('/general/healthy')
    } catch (err) {
        res.status(400)
        res.send('error happens when look at the record in previous day')
    }
})
router.post('/healthy/right', function (req, res, next) {
    try {
        healthyStartDate = controller.otherDay(healthyStartDate, 7)
        healthyEndDate = controller.otherDay(healthyEndDate, 7)
        res.redirect('/general/healthy')
    } catch (e) {
        res.status(400)
        res.send('error happens when look at the record in next day')
    }
})
router.post('/healthy/checkType', function (req, res, next) {
    try {
        req.session.checkType = req.body.checkType
        // res.redirect('/general/healthy')
        res.json(new SuccessModel())
    } catch (e) {
        res.status(400)
        res.send('error happens when select data type')
    }
})

module.exports = router
