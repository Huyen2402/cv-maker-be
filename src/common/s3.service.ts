import { S3 } from 'aws-sdk';
import { readFileSync } from 'fs';
export class S3Service {
  async S3UploadV2(file) {
    const s3 = new S3({
      region: 'us-east-1',
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      useDualstackEndpoint: true,
    });
    const blob = readFileSync(file.path);
    const param = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `uploads/${file.originalname}`,
      Body: blob,
    };
    const re = await s3.upload(param).promise();
    return re;
  }
}
