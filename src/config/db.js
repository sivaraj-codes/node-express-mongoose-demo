import mongoose from "mongoose";

export const connectDB = async () => {
  // mongoose.connect() manages the connection pool internally.
  // No need for a manual client singleton like the native driver.
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.PRIMARY_DB_NAME,
  });
  console.log("Ready state:", mongoose.connection.readyState);
  console.log(`Mongoose connected: ${mongoose.connection.host}`, {
    name: mongoose.connection.name,
    port: mongoose.connection.port,
    host: mongoose.connection.host,
  });
};
