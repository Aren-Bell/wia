/**
 * Dynamic Tag Color Handler
 * - Setiap 1 nama tag yang sama PASTI menghasilkan warna yang sama di seluruh aplikasi.
 * - Tag yang berbeda akan mendapatkan warna yang berbeda dari palet warna (via deterministic hash),
 *   atau dari cache/DB jika sudah pernah dibuat oleh user.
 */

// Seed warna bawaan sesuai desain Figma (dan bisa disinkronkan dari DB nanti)
const tagColorRegistry = new Map<string, string>([
  ["kebakaranhutan", "#ff6600"],
  ["tonedeaf", "#290ad5"],
  ["karhutla", "#13bc16"],
]);

// Palet warna kontras tinggi untuk tag baru dari input user
export const TAG_COLOR_PALETTE = [
  "#ff6600", // Orange
  "#290ad5", // Royal Blue
  "#13bc16", // Green
  "#d90429", // Crimson Red
  "#8338ec", // Purple
  "#0077b6", // Ocean Blue
  "#d97706", // Amber
  "#0f8b8d", // Civic Teal
  "#c026d3", // Fuchsia
  "#059669", // Emerald
  "#e11d48", // Rose
  "#4f46e5", // Indigo
] as const;

function normalizeTag(tag: string): string {
  return tag.trim().replace(/^#/, "").toLowerCase();
}

/**
 * Menghasilkan warna unik dan konsisten untuk setiap nama tag.
 * Jika tag belum ada di registry, fungsi akan menghitung hash dari string tag
 * lalu menyimpannya ke registry agar pemanggilan berikutnya selalu konsisten.
 */
export function getTagColor(tagName: string): string {
  const key = normalizeTag(tagName);
  if (!key) return TAG_COLOR_PALETTE[0];

  const existing = tagColorRegistry.get(key);
  if (existing) return existing;

  // Deterministic string hash (FNV-1a / djb2 style)
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 33) ^ key.charCodeAt(i);
  }
  const paletteIndex = Math.abs(hash) % TAG_COLOR_PALETTE.length;
  const assignedColor = TAG_COLOR_PALETTE[paletteIndex];

  tagColorRegistry.set(key, assignedColor);
  return assignedColor;
}

/**
 * Helper untuk mendaftarkan/hydrate warna tag dari database (misal Turso/Upstash)
 */
export function registerTagColors(entries: Record<string, string> | Array<{ name: string; color: string }>) {
  if (Array.isArray(entries)) {
    for (const item of entries) {
      tagColorRegistry.set(normalizeTag(item.name), item.color);
    }
    return;
  }
  for (const [name, color] of Object.entries(entries)) {
    tagColorRegistry.set(normalizeTag(name), color);
  }
}
