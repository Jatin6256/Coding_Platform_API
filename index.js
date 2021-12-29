const express = require('express')
const app = express()
const mongoose = require('mongoose');
require('dotenv').config()
const port = 3000
var loginRoute = require('./Authentication/login')
var createRoute = require('./Routes/create')
var deleteRoute = require('./Routes/delete')
var getRoute = require('./Routes/get')
var putRoute = require('./Routes/update')
const verify = require('./Middleware/authorized')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(verify)
app.use(loginRoute)
app.use(createRoute)
app.use(deleteRoute)
app.use(getRoute)
app.use(putRoute)


mongoose.connect(process.env.MONGODB_URL).then((res) => {
  console.log("Connected to database")
}).catch((err) => {
  console.log(err)
  process.exit(1)

})
app.get('/health', (req, res) => {
  res.json({msg: "OK"})
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})