const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const { parseExpenseWithOpenAI } = require('../services/aiService');

// @route   POST api/expenses
// @desc    Add an expense
router.post('/', auth, async (req, res) => {
  try {
    const { group_id, description, amount, payer_id, split_mode, splits } = req.body;
    
    const newExpense = new Expense({
      group_id,
      description,
      amount,
      payer_id,
      split_mode,
      created_by: req.user.id,
      splits
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/expenses/:groupId
// @desc    Get expenses by group
router.get('/:groupId', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ group_id: req.params.groupId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/expenses/mintsense
// @desc    Parse natural language into expense parameters
router.post('/mintsense', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Text is required' });

    // Using OpenAI by default, but you can swap to parseExpenseWithGemini
    const parsedData = await parseExpenseWithOpenAI(text);
    
    if (!parsedData) {
      return res.status(500).json({ msg: 'Failed to process AI request' });
    }
    res.json(parsedData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/expenses/:id
// @desc    Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    if (expense.created_by.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await expense.deleteOne();
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
