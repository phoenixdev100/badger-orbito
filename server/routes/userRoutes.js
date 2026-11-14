import express from 'express';
import {
    registerUser,
    loginUser,
    updateProfile,
    changePassword,
    updateUsername,
    updateVisibility,
    getPublicProfile,
    signOutAllDevices,
    setup2FA,
    enable2FA,
    disable2FA,
    verify2FALogin
} from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/2fa/verify-login', verify2FALogin);
userRouter.post('/2fa/setup', isAuthenticated, setup2FA);
userRouter.post('/2fa/enable', isAuthenticated, enable2FA);
userRouter.post('/2fa/disable', isAuthenticated, disable2FA);
userRouter.put('/profile', isAuthenticated, updateProfile);
userRouter.put('/username', isAuthenticated, updateUsername);
userRouter.put('/visibility', isAuthenticated, updateVisibility);
userRouter.put('/password', isAuthenticated, changePassword);
userRouter.post('/signout-all', isAuthenticated, signOutAllDevices);
userRouter.get('/public/:username', getPublicProfile);

export default userRouter;
