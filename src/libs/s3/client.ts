import { S3 } from "@aws-sdk/client-s3";
import * as process from "process";

import { S3_END_POINT } from "@/libs/s3/config";

const s3Client = new S3({
  forcePathStyle: false,
  endpoint: S3_END_POINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_KEY!,
    secretAccessKey: process.env.S3_SECRET!,
  },
});

export { s3Client };
