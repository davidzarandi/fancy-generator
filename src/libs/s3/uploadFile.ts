import {ObjectCannedACL, PutObjectCommand, PutObjectCommandInput} from "@aws-sdk/client-s3";
import {join} from "path";

import {s3Client} from "./client";
import {S3_BUCKET, S3_CDN_END_POINT, S3_FOLDER} from "./config";

export const s3UploadFile = async (key: string, content: string, contentType?: string) => {
  const bucketParams: PutObjectCommandInput = {
    ACL: ObjectCannedACL.public_read,
    Bucket: S3_BUCKET,
    Key: join(S3_FOLDER, key),
    Body: content,
    ContentType: contentType,
  };

  await s3Client.send(new PutObjectCommand(bucketParams));
  console.log(`Successfully uploaded object: ${bucketParams.Bucket}/${bucketParams.Key}`);
  return `https://${S3_BUCKET}.${S3_CDN_END_POINT.replace("https:", "").replaceAll("/", "")}/${
    bucketParams.Key
  }`;
};
