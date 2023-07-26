const mongoose = require('../db')

const ClinicianSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        displayname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: {
            type: String,
            set:(val)=>{
                return require('bcrypt').hashSync(val,5)
            }
        },
        birth: { type: String, required: true },
        role: { type: String, default: 'clinician' },
        patients: [
            {
                patient: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'patient',
                },
            },
        ],
        briefTextBio: { type: String, default: '' },
    },
    { timestamps: true }
)

//create collection patients in mongodb
const Clinician = mongoose.model('clinician', ClinicianSchema)

module.exports = Clinician
