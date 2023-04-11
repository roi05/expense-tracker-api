const express = require('express');

const router = express.Router();

const {
  getAllExpense,
  getSingleExpense,
  postExpense,
  deleteExpense,
  updateExpense,
} = require('../controllers/expenseController');

router.route('/').get(getAllExpense).post(postExpense);

router
  .route('/:id')
  .get(getSingleExpense)
  .delete(deleteExpense)
  .patch(updateExpense);

module.exports = router;
