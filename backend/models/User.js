const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar_color: { type: String, default: '#3B82F6' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
