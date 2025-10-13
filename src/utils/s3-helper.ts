import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config";

export class AwsS3Helper {
  private s3: S3Client;
  private bucketName: string;
  private bucketRegion: string;
  private accessKey: string;
  private secretKey: string;
  private signedUrlExpiry = 3600; // 1 hour

  constructor() {
    this.bucketName = config.awsS3Bucket;
    this.bucketRegion = config.awsS3Region;
    this.accessKey = config.awsAccessKey;
    this.secretKey = config.awsSecretKey;

    this.s3 = new S3Client({
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
      region: this.bucketRegion,
      requestHandler: { socketTimeout: 120000 },
    });
  }

  private async sendCommand(command: any) {
    return this.s3.send(command);
  }

  async uploadImage(
    key: string,
    contentType: string,
    file: Buffer
  ): Promise<string> {
    const s3Key = key;

    await this.sendCommand(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        Body: file,
        ContentType: contentType,
      })
    );
    return s3Key;
  }

  async getImageUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn: this.signedUrlExpiry });
  }

  async deleteImageFromS3(key: string) {
    await this.sendCommand(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );
  }
}
