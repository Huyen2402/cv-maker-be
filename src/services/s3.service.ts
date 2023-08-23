import { S3 } from 'aws-sdk';
import { readFileSync } from 'fs';
export class S3Service {
  async S3UploadV2(file, key) {
    const s3 = new S3({
      region: 'ap-southeast-1',
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      useDualstackEndpoint: true,
    });
    const blob = readFileSync(file.path);
    const param = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `uploads/${key}`,
      Body: blob,
    };
    const re = await s3.upload(param).promise();
    return re;
  }

  async S3UploadV3(blob, key) {
    const s3 = new S3({
      region: 'ap-southeast-1',
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      useDualstackEndpoint: true,
    });
    const param = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `uploads/${key}`,
      Body: blob,
    };
    const re = await s3.upload(param).promise();
    return re;
  }

  async GetObjectUrl(key: string) {
    try {
      const s3 = new S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        region: 'us-east-1',
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      });
      const url = await s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: 'uploads/' + key,
      });
      console.log(url);
      return url;
    } catch (error) {
      console.log(error);
    }
  }
  async createDocumentFromTemplate(templateKey: string) {
    const s3 = new S3({
      region: 'ap-southeast-1',
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      useDualstackEndpoint: true,
    });
    // Download template from S3
    const templateStream = await s3
      .getObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: 'uploads/' + templateKey,
      })
      .promise();

    return templateStream;
  }
  async DeleteObjectUrl(key: string) {
    try {
      const s3 = new S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        region: 'us-east-1',
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      });
      const result = await s3.deleteObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: 'uploads/' + key,
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
