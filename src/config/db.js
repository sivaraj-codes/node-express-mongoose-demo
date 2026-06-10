import mongoose from "mongoose";

export const connectDB = async () => {
  // mongoose.connect() manages the connection pool internally.
  // No need for a manual client singleton like the native driver.
  await mongoose.connect(process.env.MONGODB_URI);

  console.log(`Mongoose connected: ${mongoose.connection.host}`);
};
