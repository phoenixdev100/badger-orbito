// Polyfill for File API in Node.js
if (typeof global.File === 'undefined') {
    global.File = class File { };
}

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'

import userRoutes from './routes/userRoutes.js'
import platformRoutes from './routes/platformRoutes.js'
import contactRoutes from './routes/contactRoutes.js'

const PORT = process.env.PORT || 4000
const app = express()

// Disable Express fingerprinting header for security
app.disable('x-powered-by')

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
});

// Parse request body with size limits to prevent Denial of Service (DoS)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Configure CORS with allowed origins
const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://badger-orbito-frontend.vercel.app'
];

const allowedOrigins = (process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : defaultOrigins)
    .map(origin => origin.trim().replace(/\/+$/, ''));

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, server-to-server, curl)
        if (!origin) return callback(null, true);

        const cleanOrigin = origin.replace(/\/+$/, '');

        // Allow listed origins or any preview deployment on vercel.app
        const isAllowed = allowedOrigins.includes(cleanOrigin) ||
            /\.vercel\.app$/.test(new URL(cleanOrigin).hostname);

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn('Blocked by CORS policy:', origin);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Ensure DB is connected before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection error in middleware:', err.message);
        res.status(503).json({ success: false, message: 'Database service unavailable' });
    }
});

// API Routes
app.use('/api/user', userRoutes)
app.use('/api/platforms', platformRoutes)
app.use('/api/contact', contactRoutes)

app.get('/', (req, res) => res.send("Orbito API Working fine"))

// 404 handler for unknown API routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Resource not found' });
});

// Centralized error-handling middleware (prevents leaking internal stack traces)
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected server error occurred'
            : (err.message || 'Server error')
    });
});

// Only listen to port if running standalone (not in Vercel serverless function)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => console.log('Server running on port ' + PORT))
}

// Export for Vercel serverless
export default app
