const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')

const config = require('./config/dev')

// Connect to mongodb
mongoose
  .connect(
    'mongodb+srv://miraenoh:WsDQFxqTEIgSOtEe@boilerplate.6xvew.mongodb.net/boilerplate?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => {
    console.log('MongoDB Connected')
  })
  .catch((err) => {
    console.log(err)
  })

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})