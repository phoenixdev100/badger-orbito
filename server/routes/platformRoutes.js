import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { fetchAllPlatformsData, linkPlatform, verifyPlatform, deletePlatform, getUserPlatforms } from '../controllers/platformController.js';

const router = express.Router();

router.post('/link', isAuthenticated, linkPlatform);
router.post('/verify', isAuthenticated, verifyPlatform);
router.post('/delete', isAuthenticated, deletePlatform);
router.get('/status', isAuthenticated, getUserPlatforms);
router.get('/data', isAuthenticated, fetchAllPlatformsData);

export default router;
