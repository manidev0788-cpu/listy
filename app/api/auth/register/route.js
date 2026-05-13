import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { validateSignupFields } from "@/lib/registerValidation";

export const runtime = "nodejs";

const DEV_MISSING_DB_MESSAGE =
  "Database is not configured. Add MONGODB_URI (or MONGO_URL) to .env.local with your Atlas connection string, save the file, then restart npm run dev. See .env.example.";

/** User-facing fallback when Atlas / network rejects the connection */
function connectionFailureMessagePublic(err, isDevelopment) {
  if (isDevelopment) {
    return `Cannot reach MongoDB: ${String(err?.message || err)}. Typical fixes: Atlas → Network Access → allow your current IP (or 0.0.0.0/0 for dev), verify user/password and connection string format.`;
  }
  return "Sign-up is temporarily unavailable. Please try again later.";
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const rawName = (body?.name || "").toString();
  const rawEmail = (body?.email || "").toString();
  const rawPassword = (body?.password || "").toString();

  const validated = validateSignupFields({
    name: rawName,
    email: rawEmail,
    password: rawPassword,
  });
  if (!validated.ok) {
    return NextResponse.json(
      { ok: false, message: validated.message },
      { status: 400 }
    );
  }

  const { name: trimmedName, email, password } = validated;

  try {
    const db = await getDb();

    try {
      await db.collection("users").createIndex({ email: 1 }, { unique: true });
    } catch (idxErr) {
      console.error("[auth/register] users.email index:", idxErr?.message || idxErr);
    }

    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = {
      name: trimmedName ? trimmedName : email.split("@")[0],
      email,
      passwordHash,
      authProviders: ["credentials"],
      createdAt: new Date(),
    };

    let result;
    try {
      result = await db.collection("users").insertOne(user);
    } catch (insertErr) {
      if (insertErr?.code === 11000) {
        return NextResponse.json(
          {
            ok: false,
            message: "An account with this email already exists.",
          },
          { status: 409 }
        );
      }
      throw insertErr;
    }

    return NextResponse.json({
      ok: true,
      message: "Account created",
      user: {
        id: result.insertedId.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (
      err?.code === "MONGODB_NOT_CONFIGURED" ||
      /MONGODB_NOT_CONFIGURED|MONGODB_URI_NOT_CONFIGURED|connection string is not configured|Missing MONGODB_URI/i.test(
        String(err?.message || err)
      )
    ) {
      console.error("[auth/register] MongoDB not configured");
      return NextResponse.json(
        {
          ok: false,
          code: "MONGODB_NOT_CONFIGURED",
          message: isDevelopment
            ? DEV_MISSING_DB_MESSAGE
            : "Sign-up is temporarily unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }

    const name = err?.name || "";
    if (
      name === "MongoServerSelectionError" ||
      name === "MongoNetworkError" ||
      name === "MongoTimeoutError"
    ) {
      console.error("[auth/register] Mongo connection error:", err?.message || err);
      return NextResponse.json(
        {
          ok: false,
          code: "MONGODB_CONNECTION_FAILED",
          message: connectionFailureMessagePublic(err, isDevelopment),
        },
        { status: 503 }
      );
    }

    console.error("[auth/register] error:", err?.message || err);
    return NextResponse.json(
      {
        ok: false,
        message: "Could not create account. Please try again.",
      },
      { status: 500 }
    );
  }
}
