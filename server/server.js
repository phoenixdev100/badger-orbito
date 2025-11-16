// Polyfill for File and related objects needed by undici
if (typeof global.File === 'undefined') {
    class Blob {
        constructor(blobParts = [], options = {}) {
            this._buffer = Buffer.concat(blobParts.map(part => Buffer.from(part)));
            this.type = options.type || '';
            this.size = this._buffer.length;
        }
        async arrayBuffer() {
            return this._buffer.buffer.slice(
                this._buffer.byteOffset,
                this._buffer.byteOffset + this._buffer.byteLength
            );
        }
        slice(start = 0, end = this.size, type = '') {
            const slicedBuffer = this._buffer.slice(start, end);
            return new Blob([slicedBuffer], { type });
        }
        stream() {
            const { Readable } = require('stream');
            return Readable.from(this._buffer);
        }
        text() {
            return Promise.resolve(this._buffer.toString());
        }
    }

    global.Blob = Blob;

    class File extends Blob {
        constructor(fileBits, fileName, options = {}) {
            super(fileBits, options);
            this.name = fileName;
            this.lastModified = options.lastModified || Date.now();
            this.webkitRelativePath = '';
        }
    }

    global.File = File;
}

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'

import userRoutes from './routes/userRoutes.js'
import platformRoutes from './routes/platformRoutes.js';

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json())

// Allow CORS from any origin
app.use(cors({ origin: '*' }))

await connectDB()


app.use('/api/user', userRoutes)
app.use('/api/platforms', platformRoutes);

app.get('/', (req, res) => res.send("Orbito API Working fine"))

app.listen(PORT, () => console.log('Server running on port ' + PORT))