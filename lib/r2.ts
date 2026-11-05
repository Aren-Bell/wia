import "dotenv/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
export const bucketName = process.env.R2_BUCKET_NAME || "kavi-evidence";
export const publicDomain = (process.env.R2_PUBLIC_DOMAIN || "").replace(/\/$/, "");

export const isR2Configured = Boolean(
  accountId && accessKeyId && secretAccessKey && bucketName && publicDomain
);

export const r2Client = new S3Client({
  region: "auto",
  endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  contentType: string;
}

/**
 * Upload an image buffer or file to Cloudflare R2
 */
export async function uploadToR2(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder = "evidence"
): Promise<UploadResult> {
  if (!isR2Configured) {
    throw new Error(
      "Cloudflare R2 is not fully configured in .env (Check R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_DOMAIN)"
    );
  }

  const cleanFilename = filename.toLowerCase().replace(/[^a-z0-9.]/g, "-");
  const ext = cleanFilename.split(".").pop() || "jpg";
  const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const key = `${folder}/${uniqueId}.${ext}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const url = `${publicDomain}/${key}`;

  return {
    url,
    key,
    size: buffer.length,
    contentType,
  };
}
