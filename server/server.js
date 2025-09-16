import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())

// Allow CORS from any origin
app.use(cors({ origin: '*' }))

await connectDB()

app.get('/', (req, res) => res.send("Badger API Working fine"))

app.listen(PORT, () => console.log('Server running on port ' + PORT))