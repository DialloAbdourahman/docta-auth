import "reflect-metadata";
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
// We will just add it on the model and implement it on the update (ecrasement just like IYVO)
// Visit doctolib and add attributes like diplomas (year and title), experiences (range, title), languages (title, level ENUM), faqs (question and answer), expertises (title e.g Maladie de Parkinson,Sclérose en plaques (SEP),Électromyogramme (EMG)),

// Start looking at the email service with ses and sqs.
