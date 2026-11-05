import { NextRequest } from "next/server";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";

/**
 * Resolves the currently authenticated user for API handlers.
 * - Checks x-user-id header (convenient for API testing/dev).
 * - Fallback: creates or returns a default dev citizen user if no session is set.
 */
export async function getSessionUser(req?: NextRequest) {
  const headerUserId = req?.headers.get("x-user-id");

  if (headerUserId) {
    const existing = await db.query.users.findFirst({
      where: eq(users.id, headerUserId),
    });
    if (existing) return existing;
  }

  // Check if default dev user exists or create one
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
