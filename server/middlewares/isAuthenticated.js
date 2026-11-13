import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
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
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid. Please login again.' });
  }
};

export default isAuthenticated;
