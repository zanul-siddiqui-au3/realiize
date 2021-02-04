import * as AWS from 'aws-sdk';


class FileService {
    uploadToS3 = async (file) => {
        const BUCKET_NAME = process.env.BUCKET_NAME;
        const IAM_USER_KEY = process.env.IAM_USER_KEY;
        const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

        const s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
        });
        const params = {
            Bucket: BUCKET_NAME,
            Key: file.name,
            Body: file.data
        };
        return s3bucket.putObject(params);
    }
}

export const fileService = new FileService();
