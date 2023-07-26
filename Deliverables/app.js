var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const exphbs = require('express-handlebars')

const passport = require('passport')
const flash = require('express-flash')

const indexRouter = require('./routes/index')
const patientRouter = require('./routes/patient')
const patientProfileRouter = require('./routes/patientProfile')
const recordRouter = require('./routes/recordData')
const leaderBoardRouter = require('./routes/leaderBoard')
const clinicianRouter = require('./routes/clinician')

var app = express()


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'static')))
app.engine(
    'hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: 'hbs',
        helpers: require('./public/js/helpers.js').helpers,
    })
)

require('./config/passport')(passport)
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            path: '/', //default
            httpOnly: true, //default
            // the expired time of cookie
            maxAge: 24 * 60 * 60 * 1000,
        },
        // store the data which are in session directly in redis
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
            // mongoUrl: 'mongodb://localhost:27017',
            dbName: 'WebProject', //dbName
        }),
    })
)
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use('/general', indexRouter)
app.use('/general', patientRouter)
app.use('/general', patientProfileRouter)
app.use('/general', recordRouter)
app.use('/general', leaderBoardRouter)
app.use('/general', clinicianRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'dev' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
