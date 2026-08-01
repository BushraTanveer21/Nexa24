const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    
    const newInquiry = new Inquiry({
      fullName,
      email,
      phone,
      subject,
      message
    });

    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting inquiry', error: error.message });
  }
});

module.exports = router;
