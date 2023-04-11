require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const expenseRoute = require('./routes/expense');
const app = express();

app.use(cors());
app.use(morgan('tiny'));

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/expense', expenseRoute);

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
