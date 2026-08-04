const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

let mockInquiries = [];

router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, organization, service, message } = req.body;
    
    const newInquiry = new Inquiry({
      fullName,
      email,
      phone,
      organization,
      service,
      message
    });

    try {
      await newInquiry.save();
    } catch (dbError) {
      console.log('MongoDB save failed, falling back to in-memory array.');
      mockInquiries.push({ ...newInquiry.toObject(), createdAt: new Date() });
    }
    
    res.status(201).json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting inquiry', error: error.message });
  }
});
// GET route for Admin Panel to fetch all inquiries
router.get('/', async (req, res) => {
  try {
    let inquiries;
    try {
      // Fetch all inquiries, sorted by newest first
      inquiries = await Inquiry.find().sort({ createdAt: -1 });
    } catch (dbError) {
      console.log('MongoDB fetch failed, falling back to in-memory array.');
      inquiries = [...mockInquiries].reverse();
    }
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries', error: error.message });
  }
});

module.exports = router;
