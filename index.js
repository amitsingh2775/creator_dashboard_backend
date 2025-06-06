const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
// https://creatordashboard-rho.vercel.app
// http://localhost:5173
app.use(cors({ origin: 'https://creatordashboard-rho.vercel.app', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/credits', require('./routes/creditRoutes'));
app.use('/api/feed', require('./routes/feedRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));