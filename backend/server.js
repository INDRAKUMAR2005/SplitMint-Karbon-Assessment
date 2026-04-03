const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);

// Default status route
app.get('/', (req, res) => {
  res.send('SplitMint API is running normally!');
});

// MongoDB connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected to SplitMint db'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('Skipping MongoDB connection on Vercel to prevent crashes (No URI provided)');
}

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
