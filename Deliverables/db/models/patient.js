const mongoose = require('../db')

const PatientSchema = mongoose.Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        dateofBirth: { type: String, required: true },
        patientcomment: { type: String },
        notes: {
            type: Array,
            default: [],
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        upper: {
            blood: { type: Number, default: 0 },
            weight: { type: Number, default: 0 },
            insulin: { type: Number, default: 0 },
            exercise: { type: Number, default: 0 },
        },
        lower: {
            blood: { type: Number, default: 0 },
            weight: { type: Number, default: 0 },
            insulin: { type: Number, default: 0 },
            exercise: { type: Number, default: 0 },
        },
        timeSeries: {
            bloodEnter: { type: Boolean, default: false },
            weightEnter: { type: Boolean, default: false },
            insulinEnter: { type: Boolean, default: false },
            exerciseEnter: { type: Boolean, default: false },
        },
        password: {
            type: String,
            set:(val)=>{
                return require('bcrypt').hashSync(val,5)
            },
            required: true
        },
        realname: String,
        registerTime: String,
        role: { type: String, default: 'patient' },
        email: { type: String, required: true, unique: true },
        supportMsg: { type: String, default: '' },
        recordedDate: { type: Number, default: 0 },
        recordedTime: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0 },
        clinicianId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'clinician',
        },
        address: { type: String, default: '' },
        briefTextBio: { type: String, default: '' },
    },
    { timestamps: true }
)

//create collection users in mongodb
const Patient = mongoose.model('patient', PatientSchema)

module.exports = Patient
