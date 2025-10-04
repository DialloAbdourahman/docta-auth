import app from "./app";
import config from "./config";
import mongoose from "mongoose";
import { LoggedInUserTokenData } from "./interfaces/LoggedInUserToken";

declare global {
  namespace Express {
    interface Request {
      currentUser?: LoggedInUserTokenData;
    }
  }
}

const start = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected");
    console.log("Registered models:", mongoose.modelNames());

    app.listen(config.port, () => {
      console.log(`Doctor Auth API running on port ${config.port}`);
    });

    process.on("SIGINT", async () => {
      console.log("Gracefully shutting down...");
      await mongoose.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

start();

// Doctor //
// Route for the doctor to upload his picture.

// Patient //
// Update my patient's profile information.
// Get my patient's profile information.

// Admin //
// Deactive doctors.
// Delete doctors.
// Delete patients.
// CRUD Specialties.

// Start looking at the email service with ses and sqs.

// Add a logger and store error logs
