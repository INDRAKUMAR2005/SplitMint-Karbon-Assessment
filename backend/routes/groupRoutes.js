const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Group = require('../models/Group');

// @route   POST api/groups
// @desc    Create a group
router.post('/', auth, async (req, res) => {
  try {
    const newGroup = new Group({
      name: req.body.name,
      created_by: req.user.id,
      participants: [{
        user_id: req.user.id,
        name: req.body.user_name || 'Me', // primary user
        avatar_color: '#3B82F6'
      }]
    });
    const group = await newGroup.save();
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/groups
// @desc    Get all user's groups
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ 'participants.user_id': req.user.id }).sort({ date: -1 });
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/groups/:id/participants
// @desc    Add a participant to group
router.put('/:id/participants', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ msg: 'Group not found' });
    
    // Check max participants 3 + primary = 4
    if (group.participants.length >= 4) {
      return res.status(400).json({ msg: 'Maximum 4 participants allowed' });
    }

    const { name, avatar_color } = req.body;
    group.participants.push({ name, avatar_color: avatar_color || '#10B981' });

    await group.save();
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
