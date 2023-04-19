const express = require('express');

const router = express.Router();

const { authMiddleware } = require('../middleware/auth');

const {
  getAllExpense,
  getSingleExpense,
  postExpense,
  deleteExpense,
  updateExpense,
} = require('../controllers/expenseController');

router.use(authMiddleware);

router.route('/').get(getAllExpense).post(postExpense);

router
  .route('/:id')
  .get(getSingleExpense)
  .delete(deleteExpense)
  .patch(updateExpense);

module.exports = router;
