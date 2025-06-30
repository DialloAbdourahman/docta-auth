import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  activationTokenSecret: string;
}

const config: Config = {
  port: Number(process.env.PORT),
  nodeEnv: String(process.env.NODE_ENV),
  mongoUri: String(process.env.MONGO_URI),
  activationTokenSecret: String(process.env.ACTIVATION_TOKEN_SECRET),
};

export default config;
