const mongoose = require('mongoose');

// Single source of truth for the DB connection. server.js calls this
// (the old inline connect in server.js has been retired to remove the
// duplicated connection logic flagged in the audit).
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set. Add it to your .env file.');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
