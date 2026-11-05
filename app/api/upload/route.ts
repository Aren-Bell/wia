import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-helper";
import { enforceRateLimit } from "@/lib/rate-limit";
import { uploadToR2, isR2Configured } from "@/lib/r2";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per evidence photo

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getSessionUser(req);

    // 1. Rate Limiting: Max 20 image uploads per minute
    const rateLimitError = enforceRateLimit(
      req,
      currentUser.id,
      { limit: 20, windowMs: 60000 },
      "upload"
    );
    if (rateLimitError) return rateLimitError;

    // 2. Check R2 readiness
    if (!isR2Configured) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cloudflare R2 is not configured. Please supply R2 credentials in .env.",
        },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'file' field in formData" },
        { status: 400 }
      );
    }

    // 3. Validate MIME type
    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: ${mimeType}. Allowed: JPEG, PNG, WEBP, GIF, HEIC`,
        },
        { status: 400 }
      );
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds 5MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        },
        { status: 400 }
      );
    }

    const folder = (formData.get("folder") as string) || "evidence";
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = (file as any).name || "evidence.jpg";

    const uploadResult = await uploadToR2(buffer, originalName, mimeType, folder);

    return NextResponse.json({
      success: true,
      data: uploadResult,
    });
  } catch (error: any) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to upload image to storage",
      },
      { status: 500 }
    );
  }
}
