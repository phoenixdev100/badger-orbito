import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {
  fetchAllPlatformsData,
  linkPlatform,
  verifyPlatform,
  deletePlatform,
  getUserPlatforms,
  updatePlatformVisibility,
} from '../controllers/platformController.js';

const router = express.Router();

router.post('/link',       isAuthenticated, linkPlatform);
router.post('/verify',     isAuthenticated, verifyPlatform);
router.post('/delete',     isAuthenticated, deletePlatform);
router.patch('/visibility',isAuthenticated, updatePlatformVisibility);  // ← NEW
router.get('/status',      isAuthenticated, getUserPlatforms);
router.get('/data',        isAuthenticated, fetchAllPlatformsData);

export default router;
