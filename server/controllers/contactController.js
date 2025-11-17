import Contact from '../models/contactModel.js';
import { validationResult } from 'express-validator';

export const submitContactForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { name, email, subject, message, subscribe } = req.body;

    const newContact = await Contact.create({
      name,
      email,
      subject: subject || 'General',
      message,
      subscribe: subscribe || false
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      data: newContact
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message
    });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact messages',
      error: error.message
    });
  }
};
