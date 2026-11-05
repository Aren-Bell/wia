import type { Resolution } from "@/types/models";

export function resolutionResult(resolution: Resolution, now = Date.now()) {
  if (now < resolution.deadline) return "active";
  const total = resolution.agree + resolution.disagree;
  if (total === 0) return "automatic";
  return resolution.agree / total >= 0.8 ? "success" : "failed";
}

export function photoError(
  files: File[],
  existingCount: number,
): string | null {
  if (files.length + existingCount > 6) return "Maksimal 6 foto per postingan.";
  if (
    files.some(
      (file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type),
    )
  )
    return "Gunakan foto JPG, PNG atau WebP.";
  if (files.some((file) => file.size > 10 * 1024 * 1024))
    return "Ukuran setiap foto maksimal 10 MB.";
  return null;
}
