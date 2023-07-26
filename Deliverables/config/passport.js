const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const Patient = require('../db/models/patient')
const Clinician = require('../db/models/clinician')

module.exports = (passport) => {
    // following two functions are needed by passport to store user information in and retrieve user info from session
    passport.serializeUser((user, done) => {
        done(null, { _id: user._id, role: user.role })
    })

    passport.deserializeUser((login, done) => {
        if (login.role === 'patient') {
            Patient.findById(login._id, (err, user) => {
                return done(err, user)
            })
        } else if (login.role === 'clinician') {
            Clinician.findById(login._id, (err, user) => {
                return done(err, user)
            })
        } else {
            return done('This user does not have role', null)
        }
    })

    // Patient part
    passport.use(
        'patient-login',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            },
            (req, email, password, done) => {
                process.nextTick(() => {
                    // Find the user associated with the email provided by the user
                    Patient.findOne(
                        { email: email.toLowerCase() },
                        async (err, patient) => {
                            if (err) {
                                /*console.log('err: ', patient)*/
                                return done(err)
                            } else if (!patient) {
                                /*console.log('find: ', patient)*/
                                return done(
                                    null,
                                    false,
                                    req.flash('loginMessage', 'No user found. ')
                                )
                            } else if (!await bcrypt.compare(password, patient.password)) {
                                /*console.log('password: ', patient)*/
                                return done(
                                    null,
                                    false,
                                    req.flash(
                                        'loginMessage',
                                        'Oops! Wrong password.'
                                    )
                                )
                            } else {
                                /*console.log('login success: ', patient)*/
                                return done(
                                    null,
                                    patient,
                                    req.flash(
                                        'loginMessage',
                                        'Login successful'
                                    )
                                )
                            }
                        }
                    )
                })
            }
        )
    )

    // Clinician part
    passport.use(
        'clinician-login',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            },
            (req, email, password, done) => {
                process.nextTick(() => {
                    // Find the user associated with the email provided by the user
                    Clinician.findOne(
                        { email: email.toLowerCase() },
                        async (err, clinician) => {
                            if (err) {
                                /*console.log('err: ', clinician)*/
                                return done(err)
                            } else if (!clinician) {
                                /*console.log('find: ', clinician)*/
                                return done(
                                    null,
                                    false,
                                    req.flash('loginMessage', 'No user found. ')
                                )
                            } else if (!await bcrypt.compare(password, clinician.password)) {
                                /*console.log('password: ', clinician)*/
                                return done(
                                    null,
                                    false,
                                    req.flash(
                                        'loginMessage',
                                        'Oops! Wrong password.'
                                    )
                                )
                            } else {
                                /*console.log('login success: ', clinician)*/
                                return done(
                                    null,
                                    clinician,
                                    req.flash(
                                        'loginMessage',
                                        'Login successful'
                                    )
                                )
                            }
                        }
                    )
                })
            }
        )
    )
}
