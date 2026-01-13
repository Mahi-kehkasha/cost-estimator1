import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cache-api';
    
    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI not found in environment variables. Using default: mongodb://localhost:27017/cache-api');
      console.warn('💡 Create a .env file with MONGODB_URI for production use.');
    } else {
      // Debug: Show connection string (hide password)
      const debugURI = mongoURI.replace(/:\/\/[^:]+:[^@]+@/, '://USERNAME:***@');
      console.log('🔗 Connecting to MongoDB:', debugURI);
    }
    
    const conn = await mongoose.connect(mongoURI, {
      // Note: useNewUrlParser and useUnifiedTopology are default in Mongoose 6+
      // Keeping for compatibility with older versions
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Make sure MongoDB is running and the connection string is correct.');
    throw error;
  }
};

