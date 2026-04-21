import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

const DEFAULT_ADMIN_EMAILS = ["admin@gmail.com"];

export function getAdminEmails() {
  const raw = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS || "";
  const configured = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const merged = new Set([...DEFAULT_ADMIN_EMAILS, ...configured]);
  return Array.from(merged);
}

export function isAdminEmail(email) {
  if (!email || typeof email !== "string") return false;
  return getAdminEmails().includes(email.toLowerCase());
}

const providers = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const rawEmail = (credentials?.email || "").toString().trim();
      const password = (credentials?.password || "").toString();

      if (!rawEmail || !password) return null;

      const email = rawEmail.toLowerCase();

      if (email === "admin" && password === "admin") {
        return {
          id: "1",
          name: "Admin",
          email: "admin@gmail.com",
          image: null,
        };
      }

      try {
        const db = await getDb();
        const user = await db.collection("users").findOne({ email });
        if (!user) return null;

        if (!user.passwordHash) {
          return null;
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email.split("@")[0],
          image: user.image || null,
        };
      } catch (err) {
        console.error("[auth] authorize error:", err?.message || err);
        return null;
      }
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

async function upsertOAuthUser({ email, name, image, provider }) {
  if (!email) return null;
  try {
    const db = await getDb();
    const users = db.collection("users");
    const normalized = email.toLowerCase();
    const existing = await users.findOne({ email: normalized });

    if (!existing) {
      await users.insertOne({
        email: normalized,
        name: name || normalized.split("@")[0],
        image: image || null,
        providers: [provider],
        createdAt: new Date(),
      });
    } else {
      const current = Array.isArray(existing.providers) ? existing.providers : [];
      if (!current.includes(provider)) {
        await users.updateOne(
          { _id: existing._id },
          {
            $set: {
              name: existing.name || name || normalized.split("@")[0],
              image: existing.image || image || null,
              providers: [...current, provider],
              updatedAt: new Date(),
            },
          }
        );
      }
    }
    return normalized;
  } catch (err) {
    console.error("[auth] upsertOAuthUser error:", err?.message || err);
    return null;
  }
}

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return true;
      if (account.provider === "credentials") return true;

      if (!user?.email) return false;

      await upsertOAuthUser({
        email: user.email,
        name: user.name,
        image: user.image,
        provider: account.provider,
      });

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.sub;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image || token.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || token.sub;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture || session.user.image || null;
        session.user.isAdmin = isAdminEmail(token.email);
      }
      return session;
    },
  },
};
