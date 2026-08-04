const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// In-memory fallback if MongoDB is not running locally (starts empty)
let mockTestimonials = [];

// POST: Add a new testimonial (for Admin Panel)
router.post('/', async (req, res) => {
  try {
    const { authorName, organization, role, content } = req.body;
    
    const newTestimonial = new Testimonial({
      authorName,
      organization,
      role,
      content
    });

    try {
      await newTestimonial.save();
    } catch (dbError) {
      console.log('MongoDB save failed, falling back to in-memory array for Testimonials.');
      mockTestimonials.unshift({ ...newTestimonial.toObject(), _id: Date.now().toString(), createdAt: new Date() });
    }
    
    res.status(201).json({ message: 'Testimonial added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding testimonial', error: error.message });
  }
});

// GET: Fetch all testimonials
router.get('/', async (req, res) => {
  try {
    let testimonials;
    try {
      // Fetch all testimonials, sorted by newest first
      testimonials = await Testimonial.find().sort({ createdAt: -1 });
    } catch (dbError) {
      console.log('MongoDB fetch failed, falling back to in-memory array for Testimonials.');
      testimonials = [...mockTestimonials];
    }
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
  }
});

module.exports = router;
