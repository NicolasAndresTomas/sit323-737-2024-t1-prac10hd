const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 8081;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
const mongoURI = 'mongodb://admin1:password123@mongo-0.mongo,mongo-1.mongo,mongo-2.mongo:27017/test?replicaSet=rs0&authSource=admin';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('connected to MongoDB');
}).catch(err => {
  console.error('failed to connect to MongoDB', err);
});

// Mongoose schema and model
const subscriberSchema = new mongoose.Schema({
  email: String
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('email is required');
  }

  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(200).send('successful');
  } catch (error) {
    res.status(500).send('failed');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});