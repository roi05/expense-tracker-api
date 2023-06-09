require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const expenseRoute = require('./routes/expense');
const userRoute = require('./routes/user');
const corsOption = require('./utils/corsOption');
const app = express();

app.use(cors(corsOption));
app.use(morgan('tiny'));

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/expense', expenseRoute);
app.use('/api/v1/user', userRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`listening on port`, process.env.PORT);
    });
  })
  .catch(error => {
    console.log(error);
  });
