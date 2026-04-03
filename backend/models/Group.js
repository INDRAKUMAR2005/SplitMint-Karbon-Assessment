const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  avatar_color: { type: String, default: '#10B981' }
});

const GroupSchema = new Schema({
  name: { type: String, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [ParticipantSchema]
}, { timestamps: true });

module.exports = mongoose.model('Group', GroupSchema);
