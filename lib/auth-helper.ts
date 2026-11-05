import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";

/**
 * Resolves the currently authenticated user for API handlers:
 * 1. Checks real NextAuth session.
 * 2. Fallback: checks x-user-id header (for API dev/curl testing).
 * 3. Fallback: returns default dev citizen user for local testing.
 */
export async function getSessionUser(req?: NextRequest) {
  // 1. Real session check
  try {
    const session = await auth();
    if (session?.user?.id) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
      });
      if (dbUser) return dbUser;
    }
  } catch (err) {
    // Session check skipped in non-cookie environments
  }

  // 2. Dev header check
  const headerUserId = req?.headers.get("x-user-id");
  if (headerUserId) {
    const existing = await db.query.users.findFirst({
      where: eq(users.id, headerUserId),
    });
    if (existing) return existing;
  }

  // 3. Fallback dev citizen user
  const devId = "usr_dev_citizen";
  let devUser = await db.query.users.findFirst({
    where: eq(users.id, devId),
  });

  if (!devUser) {
    const now = new Date();
    await db.insert(users).values({
      id: devId,
      name: "Mira Sualifah",
      username: "miraaaaaaaa",
      email: "mira@kavi.id",
      role: "USER",
      bio: "Just a mom that care with her country situation. #SuarakanRakyat",
      createdAt: now,
      updatedAt: now,
    });

    devUser = await db.query.users.findFirst({
      where: eq(users.id, devId),
    });
  }

  return devUser!;
}
