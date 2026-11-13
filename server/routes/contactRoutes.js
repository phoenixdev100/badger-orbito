import express from 'express';
import { body } from 'express-validator';
import { submitContactForm, getContactMessages } from '../controllers/contactController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Validation rules
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('subject').optional().isIn(['General', 'Pricing', 'Technical']).withMessage('Invalid subject'),
  body('message').trim().notEmpty().withMessage('Message is required')
];

// Routes
router.post('/submit', contactValidation, submitContactForm);
// Protect messages endpoint from unauthorized data scraping / info disclosure
router.get('/messages', isAuthenticated, getContactMessages);

export default router;
