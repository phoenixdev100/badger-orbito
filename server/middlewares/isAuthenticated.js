import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Missing authentication token.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token || !token.trim()) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Invalid token format.' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('CRITICAL: JWT_SECRET environment variable is missing!');
    return res.status(500).json({ success: false, message: 'Authentication service configuration error.' });
  }

  try {
    const decoded = jwt.verify(token.trim(), process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid token payload.' });
    }

    // Invalidate tokens issued before the last password change
    if (decoded.iat) {
      const user = await userModel.findById(decoded.id).select('passwordChangedAt').lean();
      if (user?.passwordChangedAt && decoded.iat * 1000 < user.passwordChangedAt.getTime()) {
        return res.status(401).json({ success: false, message: 'Session expired. Password was changed, please login again.' });
      }
    }

    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid. Please login again.' });
  }
};

export default isAuthenticated;
