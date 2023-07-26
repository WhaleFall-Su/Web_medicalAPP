const mongoose = require('../db')

const RecordSchema = new mongoose.Schema(
    {
        title: { type: String, default: 'Record' },
        date: { type: String },
        healthy: {
            blood: { type: Number, default: null },
            weight: { type: String, default: '' },
            insulin: { type: String, default: '' },
            exercise: { type: Number, default: null },
            bloodEnter: { type: Boolean, default: false },
            weightEnter: { type: Boolean, default: false },
            insulinEnter: { type: Boolean, default: false },
            exerciseEnter: { type: Boolean, default: false },
        },
        todayRate: { type: Number, default: 0 },
        allRate: { type: Number, default: 0 },
        comment: { type: String, default: '' },
        updatedData: {
            bloodUpdated: { type: Boolean, default: false },
            weightUpdated: { type: Boolean, default: false },
            insulinUpdated: { type: Boolean, default: false },
            exerciseUpdated: { type: Boolean, default: false },
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'patient',
        },
        clinicianId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'clinician',
        },
        recordedTime: { type: Number, default: 0 }
    },
    { timestamps: true }
)

//create collection records in mongodb
const RecordData = mongoose.model('record', RecordSchema)

module.exports = RecordData
