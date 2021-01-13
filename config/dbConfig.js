const mongoose = require('mongoose')
const { mongoURI } = require('./keys_dev')

const connectDB = async () => {
  const uri = mongoURI
  mongoose
    .connect(process.env.MONGODB_URI ||uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,

    })
    .then(() => {
      console.log('MongoDB Connected…')
    })
    .catch((err) => console.log(err))
}

module.exports = { connectDB }
