// local db
// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }
//
// const mongoose = require('mongoose')
//
// const url = process.env.MONGO_URL
// const dbName = 'WebProject'
//
// mongoose.connect(`${url}/${dbName}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//
// const db = mongoose.connection
//
// db.on('error', (err) => {
//     console.error(err)
// })
//
// db.once('open', () => {
//     console.log('mongodb connect success')
// })
//
// module.exports = mongoose

//Cloud db
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoose = require('mongoose')

const url = process.env.MONGO_URL
// const url = "mongodb+srv://Gloaming:13456789@cluster0.l4vfl.mongodb.net/WebProject?retryWrites=true&w=majority";
// const url = "mongodb://localhost:27017";
// const dbName = "WebProject";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', (err) => {
    console.error(err)
    process.exit(1)
})

db.once('open', () => {
    console.log('mongodb open success')
    console.log(`Mongo connection started on ${db.host}:${db.port}`)
})

module.exports = mongoose
