import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined in environment variables");
        return null;
    }

    if (!cached.promise) {
        const uri = process.env.MONGODB_URI.trim();

        // If the URI doesn't explicitly specify a database, default to dbName: 'badger'
        const options = {
            bufferCommands: false,
            dbName: uri.includes('.mongodb.net/') && !uri.endsWith('.mongodb.net/') ? undefined : 'badger'
        };

        cached.promise = mongoose.connect(uri, options).then((mongooseInstance) => {
            console.log("MongoDB Connected Successfully");
            return mongooseInstance;
        }).catch((err) => {
            console.error("MongoDB Connection Failed:", err.message);
            cached.promise = null;
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        console.error("Failed to establish MongoDB connection:", error.message);
        // Do not call process.exit(1) in serverless to prevent unhandled process crashes
        if (process.env.NODE_ENV !== 'production') {
            // In local development, you may want to know immediately
        }
        return null;
    }
};

export default connectDB;
