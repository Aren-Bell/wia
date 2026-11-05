import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, accounts, sessions, users, verificationTokens } from "./db";

const baseAdapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions as any,
  verificationTokensTable: verificationTokens,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: {
    ...baseAdapter,
    async createUser(user) {
      const emailPrefix = (user.email || "user").split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
      const generatedUsername = `${emailPrefix}_${Math.random().toString(36).slice(2, 6)}`;
      const now = new Date();

      return baseAdapter.createUser!({
        ...user,
        username: generatedUsername,
        role: "USER",
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        isBanned: false,
        warningCount: 0,
        createdAt: now,
        updatedAt: now,
      } as any);
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // @ts-expect-error custom user field
        session.user.role = user.role || "USER";
        // @ts-expect-error custom user field
        session.user.username = user.username || user.name?.toLowerCase().replace(/\s+/g, "_");
        // @ts-expect-error custom user field
        session.user.agencyName = user.agencyName;
        // @ts-expect-error custom user field
        session.user.jurisdictionProvince = user.jurisdictionProvince;
      }
      return session;
    },
  },
});
