import { Injectable } from "@angular/core";
import * as S3 from "aws-sdk/clients/s3";
import * as moment from "moment";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AwsUploadService {
  constructor() {}

  uploadToS3 = async (file) => {
    const BUCKET_NAME = environment.BUCKET_NAME;
    const S3_USER_KEY = environment.S3_USER_KEY;
    const S3_USER_SECRET = environment.S3_USER_SECRET;
    const currentDateFormat = moment().format("MM-DD-YYYY__HH-mm-ss");
    const s3bucket = new S3({
      accessKeyId: S3_USER_KEY,
      secretAccessKey: S3_USER_SECRET,
    });
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${currentDateFormat}_${file.name}`,
      Body: file,
    };
    const s3BucketPromise = await s3bucket.upload(params).promise();
    return s3BucketPromise;
  };

  uploadToS3WithPercentage = (file, evtFn) => {
    const BUCKET_NAME = environment.BUCKET_NAME;
    const S3_USER_KEY = environment.S3_USER_KEY;
    const S3_USER_SECRET = environment.S3_USER_SECRET;

    const s3bucket = new S3({
      accessKeyId: S3_USER_KEY,
      secretAccessKey: S3_USER_SECRET,
    });
    const params = {
      Bucket: BUCKET_NAME,
      Key: file.name + Math.random(),
      Body: file,
    };
    return s3bucket.upload(params).on("httpUploadProgress", evtFn).promise();
  };
}
