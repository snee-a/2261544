const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./middleware/loggers');
const shortRoutes = require('./routes/shortRoutes');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/', shortRoutes);

// DB connect
mongoose.connect('mongodb://127.0.0.1:27017/urlshortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`App is listen at the port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection failed', err);
});
