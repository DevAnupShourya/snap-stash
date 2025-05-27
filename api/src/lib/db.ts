import mongoose from "mongoose";
import { ENV } from '@/utils/env.js'

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log(`MongoDB@${mongoose.version} Database connected.`);
        return true;
    } catch (error) {
        console.error("MongoDB connection error:");
        console.error(error);
        process.exit(1);
        return false;
    }
};
