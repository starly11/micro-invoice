import {
    login,
    register,
    logout,
    googleAuthCallback,
    getMe,
    updateProfile,
    changePassword,
    updateBusiness,
    deleteAccount,
} from '../controllers/authController.js';
import passport from 'passport';
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js'

const AuthRouter = express.Router();
const clientUrl = String(process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)[0] || 'http://localhost:5173';

// Route to start Google Auth
AuthRouter.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
}));

// Route for Google to call back to
AuthRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${clientUrl}/login` }),
    googleAuthCallback
);

// Get current user info (disable caching to avoid 304 with empty body)
AuthRouter.get('/me', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
}, authMiddleware, getMe);

AuthRouter.post('/signup', register);
AuthRouter.post('/login', login);
AuthRouter.post('/logout', logout);
AuthRouter.patch('/profile', authMiddleware, updateProfile);
AuthRouter.patch('/password', authMiddleware, changePassword);
AuthRouter.patch('/business', authMiddleware, updateBusiness);
AuthRouter.delete('/account', authMiddleware, deleteAccount);

export default AuthRouter;
