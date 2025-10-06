import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  activationTokenSecret: string;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  forgotPasswordTokenSecret: string;
  accessTokenExpiry: number;
  refreshTokenExpiry: number;
  awsAccessKey: string;
  awsSecretKey: string;
  awsS3Bucket: string;
  awsS3Region: string;
}

const config: Config = {
  port: Number(process.env.PORT),
  nodeEnv: String(process.env.NODE_ENV),
  mongoUri: String(process.env.MONGO_URI),
  activationTokenSecret: String(process.env.ACTIVATION_TOKEN_SECRET),
  accessTokenSecret: String(process.env.ACCESS_TOKEN_SECRET),
  refreshTokenSecret: String(process.env.REFRESH_TOKEN_SECRET),
  forgotPasswordTokenSecret: String(process.env.FORGOT_PASSWORD_TOKEN_SECRET),
  accessTokenExpiry: Number(process.env.ACCESS_TOKEN_EXPIRY),
  refreshTokenExpiry: Number(process.env.REFRESH_TOKEN_EXPIRY),
  awsAccessKey: String(process.env.AWS_ACCESS_KEY),
  awsSecretKey: String(process.env.AWS_SECRET_KEY),
  awsS3Bucket: String(process.env.AWS_S3_BUCKET),
  awsS3Region: String(process.env.AWS_S3_REGION),
};

export default config;
