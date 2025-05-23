import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";

const R2_BUCKET = process.env.R2_BUCKET!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_ENDPOINT = process.env.R2_ENDPOINT!;

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

export async function renameFile(oldKey: string, newKey: string) {
  // Copy the file to the new key
  await s3.send(
    new CopyObjectCommand({
      Bucket: R2_BUCKET,
      CopySource: `${R2_BUCKET}/${oldKey}`,
      Key: newKey,
    })
  );

  // Delete the old file
  await deleteFile(oldKey);
}
