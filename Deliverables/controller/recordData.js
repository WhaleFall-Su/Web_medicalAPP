const RecordData = require('../db/models/record')
const { updateRecordedDate, findPatient } = require('./patient')
const Patient = require('../db/models/patient')
const controller = require('../static/javascripts/usersController.js')

// Set to today time
let today = new Date().toLocaleString('en-Au', {
    timeZone: 'Australia/Melbourne',
})
today =controller.defaultDateType(today)

const getAllRecord = async (patientId) => {
    const record = await RecordData.find({
        patientId,
    })
    return record
}

const renderRecordData = async (date, patientId) => {

    const patient = await findPatient(patientId)
    let allRate
    let recordedDate = (await findPatient(patientId)).recordedDate
    const interval = controller.getDays(patient.registerTime,today)

    if (interval === 0) {
        allRate = 0
    } else {
        allRate = recordedDate / interval
    }

    const record = await RecordData.findOneAndUpdate(
        {
            patientId,
            date,
        },
        {
            allRate,
            $set: {
                'healthy.bloodEnter': patient.timeSeries.bloodEnter,
                'healthy.weightEnter': patient.timeSeries.weightEnter,
                'healthy.insulinEnter': patient.timeSeries.insulinEnter,
                'healthy.exerciseEnter': patient.timeSeries.exerciseEnter,
            },
        },
        { new: true }
    )

    return record
}

const addRecord = async (myDate, id) => {
    const patientId = id
    const date = myDate

    const patient = await findPatient(patientId)
    let clinicianId = patient.clinicianId


    let allRate
    let recordedDate = (await findPatient(patientId)).recordedDate
    const interval = controller.getDays(patient.registerTime,today)

    if (interval === 0) {
        allRate = 0
    } else {
        allRate = recordedDate / interval
    }

    const record = await RecordData.create({
        clinicianId,
        patientId,
        date,
        allRate,
        healthy: {
            bloodEnter: patient.timeSeries.bloodEnter,
            weightEnter: patient.timeSeries.weightEnter,
            insulinEnter: patient.timeSeries.insulinEnter,
            exerciseEnter: patient.timeSeries.exerciseEnter,
        },
    })

    return record
}

const updateRecord = async (id, recordData = {}, date) => {
    const healthy = recordData
    let patient = await findPatient(id)
    let recordedDate = patient.recordedDate
    let recordedTime = (await renderRecordData(date,id)).recordedTime
    let allRate = 0

    // identify which time series has recorded
    if (healthy.hasOwnProperty('blood')) {
        var bloodUpdated = true
    } else if (healthy.hasOwnProperty('weight')) {
        var weightUpdated = true
    } else if (healthy.hasOwnProperty('insulin')) {
        var insulinUpdated = true
    } else if (healthy.hasOwnProperty('exercise')) {
        var exerciseUpdated = true
    }


    if (bloodUpdated && recordedTime === 0) {
        recordedDate += 1
        recordedTime += 1
        await updateRecordedDate(id, recordedDate)
        await updatedRecordedTime(id,recordedTime,date)
    } else if (healthy.weightEnter && healthy.weight && recordedTime === 0) {
        recordedDate += 1
        recordedTime += 1
        await updateRecordedDate(id, recordedDate)
        await updatedRecordedTime(id,recordedTime,date)
    } else if (healthy.insulinEnter && healthy.insulin && recordedTime === 0) {
        recordedDate += 1
        recordedTime += 1
        await updateRecordedDate(id, recordedDate)
        await updatedRecordedTime(id,recordedTime,date)
    } else if (
        healthy.exerciseEnter &&
        healthy.exercise &&
        recordedTime === 0
    ) {
        recordedDate += 1
        recordedTime += 1
        await updateRecordedDate(id, recordedDate)
        await updatedRecordedTime(id,recordedTime,date)
    }


    const interval = controller.getDays(patient.registerTime,today)

    allRate = recordedDate / interval


    let record;

    if (bloodUpdated) {
        record = await RecordData.findOneAndUpdate(
            {
                patientId: id,
                date: date,
            },
            {
                $set: {
                    'healthy.blood': healthy.blood,
                    /*'healthy.weightEnter': patient.timeSeries.weightEnter,
                    'healthy.insulinEnter': patient.timeSeries.insulinEnter,
                    'healthy.exerciseEnter': patient.timeSeries.exerciseEnter,*/
                    'updatedData.bloodUpdated': bloodUpdated
                },
                allRate,
            },
            { new: true }
        )
    }

    if (weightUpdated) {
        record = await RecordData.findOneAndUpdate(
            {
                patientId: id,
                date: date,
            },
            {
                $set: {
                    'healthy.weight': healthy.weight,
                    'updatedData.weightUpdated': weightUpdated
                },
                allRate,
            },
            { new: true }
        )
    }

    if (insulinUpdated) {
        record = await RecordData.findOneAndUpdate(
            {
                patientId: id,
                date: date,
            },
            {
                $set: {
                    'healthy.insulin': healthy.insulin,
                    'updatedData.insulinUpdated': insulinUpdated
                },
                allRate,
            },
            { new: true }
        )
    }

    if (exerciseUpdated) {
        record = await RecordData.findOneAndUpdate(
            {
                patientId: id,
                date: date,
            },
            {
                $set: {
                    'healthy.exercise': healthy.exercise,
                    'updatedData.exerciseUpdated': exerciseUpdated
                },
                allRate,
            },
            { new: true }
        )
    }

    if (record == null) {
        return false
    }
    return true
}

const updateComment = async (id, newComment = {}, date) => {
    const comment = newComment.comment
    const record = await RecordData.findOneAndUpdate(
        {
            patientId: id,
            date: date,
        },
        {
            comment,
            updatedComment: true,
        },
        { new: true }
    )

    await Patient.findOneAndUpdate(
        {
            _id: id,
        },
        {
            patientcomment: comment
        },
        { new: true }
    )
    // console.log(record);
    if (record == null) {
        return false
    }
    return true
}

const updatedRecordedTime = async (patientId,recordedTime,date) => {
    await RecordData.findOneAndUpdate(
        {
            patientId,
            date
        },
        {
            recordedTime
        },
        {new:true}
    )
}

module.exports = {
    getAllRecord,
    renderRecordData,
    addRecord,
    updateRecord,
    updateComment,
}
