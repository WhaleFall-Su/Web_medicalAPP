const Patient = require('../db/models/patient')
const bcrypt = require('bcrypt')

const login = async (username, password) => {
    console.log(username, password)
    const user = await Patient.findOne({
        username,
        password,
    })
    if (user == null) {
        return {}
    }
    return user
}

const getAllPatient = async () => {
    const allUser = await Patient.find()
    return allUser
}

const logout = (req, res) => {
    console.log('log out')
    req.logout()
    res.redirect('/general/home')
}



const findPatient = async (patientId) => {
    const user = await Patient.findOne({
        _id: patientId,
    })
    if (user == null) {
        return
    }
    return user
}

const updateRecordedDate = async (patientId, recordedDate, recordedTime) => {
    // console.log(patientId);
    const user = await Patient.findOneAndUpdate(
        { _id: patientId },
        {
            recordedDate,
            recordedTime,
        },
        { new: true }
    )
}

module.exports = {
    login,
    findPatient,
    getAllPatient,
    logout,
    updateRecordedDate,
}
