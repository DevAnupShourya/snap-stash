import mongoose from "mongoose";
import { ENV } from '@/utils/env.js'

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log(`✅ MongoDB:${mongoose.version} connected`);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};
