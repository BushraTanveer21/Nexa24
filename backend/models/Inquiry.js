const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  organization: { type: String },
  service: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', InquirySchema);
