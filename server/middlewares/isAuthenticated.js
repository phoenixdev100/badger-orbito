import jwt from 'jsonwebtoken'

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    return next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Please login first' })
  }
}

export default isAuthenticated
