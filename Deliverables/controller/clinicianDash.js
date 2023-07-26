const RecordData = require('../db/models/record')

const isBloodLow = (num, th) => {
    if (num < th) {
        return true
    }
    return false
}

const isBloodHigh = (num, th) => {
    if (num > th) {
        return true
    }
    return false
}

const isStepLow = (num, th = 300) => {
    if (num < th) {
        return true
    }
    return false
}

const isStepHigh = (num, th = 20000) => {
    if (num > th) {
        return true
    }
    return false
}

const isWeightHigh = (num, th = 100) => {
    if (num > th) {
        return true
    }
    return false
}

const isWeightLow = (num, th = 40) => {
    if (num < th) {
        return true
    }
    return false
}

const isInsulinHigh = (num, th = 10) => {
    if (num > th) {
        return true
    }
    return false
}

const isInsulinLow = (num, th = 4) => {
    if (num < th) {
        return true
    }
    return false
}

const displayRecord = async (date) => {
    //console.log('find')
    const record = await RecordData.find({
        date,
    })
    // console.log("-- record info when display -- ", record);
    return record
}

module.exports = {
    isBloodLow,
    isBloodHigh,
    isStepLow,
    isStepHigh,
    isInsulinHigh,
    isInsulinLow,
    isWeightHigh,
    isWeightLow,
    displayRecord,
}
