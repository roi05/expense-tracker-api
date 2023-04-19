const mongoose = require('mongoose');
const Expense = require('../models/expenseModel');
const expenseValidation = require('../utils/expenseValidation');

const getAllExpense = async (req, res) => {
  const expense = await Expense.find({ user_id: req.user }).sort({
    createdAt: -1,
  });
  res.status(200).json({ expense });
};

const postExpense = async (req, res) => {
  const expense = req.body;
  const { error, value } = expenseValidation(expense);

  const newValues = { ...value, user_id: req.user };

  if (error) {
    return res.status(400).json({ error: error.details });
  }
  try {
    const data = await Expense.create(newValues);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSingleExpense = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such expense' });
  }

  const expense = await Expense.findById(id);

  if (!expense) {
    return res.status(400).json({ error: 'No such expense' });
  }

  res.status(200).json({ expense });
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such expense' });
  }

  try {
    const expense = await Expense.findOneAndDelete({ _id: id });
    if (!expense) {
      return res.status(400).json({ error: 'No such expense' });
    }
    return res.status(200).json({ expense });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const updateExpense = (req, res) => {
  res.json('update request');
};

module.exports = {
  getAllExpense,
  postExpense,
  getSingleExpense,
  deleteExpense,
  updateExpense,
};
