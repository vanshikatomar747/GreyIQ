import express from 'express';
import Contact from '../models/Contact.js';
import { sendContactNotification } from '../config/mailer.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a support contact request
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All details (name, email, and message) are required.' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const contact = await Contact.create({
      name,
      email,
      message
    });

    // Send email notification (fires asynchronously, error handled gracefully)
    sendContactNotification({ name, email, message }).catch(err => {
      console.error('Failed to send contact notification email:', err.message);
    });

    res.status(201).json({ message: 'Message logged successfully.', contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
