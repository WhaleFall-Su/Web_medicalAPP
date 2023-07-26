// middleware to ensure patient is logged in
function unLoggedIn(req, res, next) {
    req.session.logNum = 0
    if (req.isAuthenticated()) {
        return res.redirect('/general/dashboard')
    }
    next()
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    // if not logged in, redirect to login form
    res.redirect('/general/login')
}

function clinicianUnLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/general/clinicianDashboard')
    }
    next()
}

function isClinicianLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    // if not logged in, redirect to login form
    res.redirect('/general/clinicianLoginForm')
}

module.exports = {
    isLoggedIn,
    unLoggedIn,
    isClinicianLoggedIn,
    clinicianUnLoggedIn,
}
