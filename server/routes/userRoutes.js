import express from 'express';
import {
    registerUser,
    loginUser,
    updateProfile,
    changePassword,
    updateUsername,
    updateVisibility,
    getPublicProfile
} from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.put('/profile', isAuthenticated, updateProfile);
userRouter.put('/username', isAuthenticated, updateUsername);
userRouter.put('/visibility', isAuthenticated, updateVisibility);
userRouter.put('/password', isAuthenticated, changePassword);
userRouter.get('/public/:username', getPublicProfile);

export default userRouter;
