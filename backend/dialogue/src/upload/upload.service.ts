import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as dayjs from 'dayjs';

@Injectable()
export class UploadService {
  private s3: S3Client;

  constructor() {
    // If AWS_ACCESS_KEY_ID is set (local dev), use explicit credentials
    // Otherwise, SDK will use IAM role (AWS ECS/EC2/Lambda)
    const config: any = {
      region: process.env.AWS_REGION || 'us-east-1',
    };

    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };
    }

    this.s3 = new S3Client(config);
  }

  async uploadFile(file: Express.Multer.File, senderId: string, receiverId: string, type: 'IMAGE' | 'AUDIO') {
    //const key = `uploads /${crypto.randomUUID ()}-${file.originalname}`;
    const now = dayjs();
    const key = `${senderId}/${receiverId}/${type}/${now.format('YYYY/MM/DD/HHmmss')}_${crypto.randomUUID()}_${file.originalname}`;

    
    await this.s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType : file . mimetype,
    }));

    return {
      url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`,
      key,
    };
  }
  // NestJS backend
 async getPresignedUrl(key: string): Promise<string> {
  try {
    if (!process.env.AWS_S3_BUCKET) {
      console.error("⚠️ AWS_S3_BUCKET env variable is missing!");
      throw new Error("AWS_S3_BUCKET is not defined");
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
  } catch (err) {
    console.error("Failed to generate pre-signed URL:", err);
    throw err; // or return a fallback value if you want to continue
  }
}

 
}
