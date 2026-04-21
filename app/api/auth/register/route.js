import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

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

  const name = (body?.name || "").toString().trim();
  const email = (body?.email || "").toString().trim().toLowerCase();
  const password = (body?.password || "").toString();

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Email and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { ok: false, message: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  try {
    const db = await getDb();
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      name: name || email.split("@")[0],
      email,
      passwordHash,
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(user);

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
    console.error("[auth/register] error:", err?.message || err);
    return NextResponse.json(
      { ok: false, message: "Could not create account. Please try again." },
      { status: 500 }
    );
  }
}
