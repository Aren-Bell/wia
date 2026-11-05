import "dotenv/config";
import { uploadToR2, isR2Configured, bucketName, publicDomain } from "../lib/r2";

async function testR2() {
  console.log("=== TESTING CLOUDFLARE R2 OBJECT STORAGE ===");
  console.log("-> Config check:");
  console.log("   isR2Configured:", isR2Configured);
  console.log("   bucketName:", bucketName);
  console.log("   publicDomain:", publicDomain);

  if (!isR2Configured) {
    throw new Error("R2 is not properly configured in .env");
  }

  // 1x1 transparent PNG buffer
  const samplePngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    "base64"
  );

  console.log("-> Uploading test sample image to R2 bucket 'kavi'...");
  const result = await uploadToR2(
    samplePngBuffer,
    "citizen_evidence_test.png",
    "image/png",
    "evidence"
  );

  console.log("   Upload SUCCESS!");
  console.log("   Object Key:", result.key);
  console.log("   Public CDN URL:", result.url);
  console.log("   Size:", result.size, "bytes");

  console.log("-> Verifying HTTP reachability of public domain...");
  try {
    const res = await fetch(result.url, { method: "HEAD" });
    console.log("   HTTP status from public CDN:", res.status);
    if (res.ok) {
      console.log("   PASS: Image is publicly accessible via custom domain!");
    } else {
      console.log("   NOTE: CDN returned status", res.status, "(DNS/TLS propagation might take 1-2 minutes)");
    }
  } catch (err: any) {
    console.log("   NOTE: Domain check error:", err?.message);
  }

  console.log("=== R2 TEST COMPLETED ===");
}

testR2().catch((err) => {
  console.error("R2 test failed:", err);
  process.exitCode = 1;
});
