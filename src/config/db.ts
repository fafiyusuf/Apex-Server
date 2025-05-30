import 'dotenv/config'; // Ensure dotenv is loaded very early
import mongoose from 'mongoose';

const connectDB = async () => {
  // Log the actual URI your application is trying to use
  console.log('DB_DEBUG: Attempting to connect to MongoDB with URI:', process.env.MONGO_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    // Log the actual host it connected to
    console.log(`DB_DEBUG: MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`DB_DEBUG: Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;