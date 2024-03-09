const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const URL = process.env.MONGO_URL

const db = () => {
  mongoose
    .connect(URL)
    .then(() => {
      console.log('DB is Connected')
    })
    .catch(err => {
      console.log('Invalid Connetion', err)
    })
}
module.exports = db
