import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const R2_BUCKET = process.env.R2_BUCKET!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_ENDPOINT = process.env.R2_ENDPOINT!;

export const fileTypes = [
  "all",
  "images",
  "pdfs",
  "documents",
  "sheets",
  "text",
  "others",
] as const;
export type FileType = (typeof fileTypes)[number];

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  apiVersion: "v4",
});

export async function deleteFile(key: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    })
  );
}

export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
) {
  return await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
}

export async function getFileMetadata(key: string) {
  return await s3.send(
    new HeadObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    })
  );
}
