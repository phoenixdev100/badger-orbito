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

app.use(express.json())

// Configure CORS with allowed origins from environment
const allowedOrigins = process.env.ALLOWED_ORIGINS ?
    process.env.ALLOWED_ORIGINS.split(',') : [];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

await connectDB()

app.use('/api/user', userRoutes)
app.use('/api/platforms', platformRoutes)
app.use('/api/contact', contactRoutes)

app.get('/', (req, res) => res.send("Orbito API Working fine"))

app.listen(PORT, () => console.log('Server running on port ' + PORT))