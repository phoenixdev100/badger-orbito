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

// Allow CORS from any origin
app.use(cors({ origin: '*' }))

await connectDB()

app.use('/api/user', userRoutes)
app.use('/api/platforms', platformRoutes)
app.use('/api/contact', contactRoutes)

app.get('/', (req, res) => res.send("Orbito API Working fine"))

app.listen(PORT, () => console.log('Server running on port ' + PORT))