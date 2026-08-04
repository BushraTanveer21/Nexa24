const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const contactRoutes = require('./routes/contactRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nexa24')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
