const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

await dbConnect()
async function dbConnect() {
  const dbUrl =
    'mongodb+srv://poornesh:poornesh@cluster0.hdkwk.mongodb.net/?retryWrites=true&w=majority'
  await mongoose
    .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
      (db) => {
        console.log('Database connection is successful')
      },
      (err) => console.log(err)
    )
}

const app = express()

app.use(express.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
})

const User = new mongoose.model('user', userSchema)

app.get('/', (req, res) => {
  res.send('server is running at port 3005')
})

app.post('/signup', async (req, res) => {
  const newUser = await new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  }).save()

  res.status(200).send({ message: 'Successfully registered' })
})

app.post('/signin', async (req, res) => {
  const found = await User.findOne({ email: req.body.email })
  if (!found) {
    res.status(400).send({ message: 'This email is not registered' })
    return
  }
  if (found.password === req.body.password) {
    res.status(200).send('Successfully logged in')
  } else {
    res.status(400).send({ message: 'Invalid password' })
  }
})

app.listen(process.env.PORT || 3005, () => {
  console.log('Server is running at post 3005 ')
})
