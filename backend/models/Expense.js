const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SplitSchema = new Schema({
  participant_id: { type: Schema.Types.ObjectId, required: true },
  amount_owed: { type: Number, required: true }
});

const ExpenseSchema = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  payer_id: { type: Schema.Types.ObjectId, required: true },
  split_mode: { type: String, enum: ['equal', 'custom', 'percentage'], default: 'equal' },
  date: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  splits: [SplitSchema]
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
