import { config } from "../../config";
import * as moment from "moment";
import * as AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: config.S3_USER_KEY,
  secretAccessKey: config.S3_USER_SECRET,
  region: config.S3_BUCKET_REGION,
});
export class AwsHelpers {
  public static getSignedUrl = async (fileName, fileType) => {
    const s3 = new AWS.S3();
    const myBucket = config.S3_BUCKET_NAME;
    const contentType = fileType;
    const signedUrlExpireSeconds = 60 * 5;
    const keyFile = `${moment().format("MM-DD-YYYY__HH-mm-ss")}_${fileName}`;
    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: myBucket,
      Key: keyFile,
      ACL: "public-read",
      Expires: signedUrlExpireSeconds,
      ContentType: contentType,
    });
    return { url, keyFile };
  };
}
