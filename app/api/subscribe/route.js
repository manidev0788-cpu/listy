import { NextResponse } from "next/server";
import { devLog } from "@/lib/devLog";

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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

  const email = String(body?.email || "")
    .trim()
    .toLowerCase()
    .slice(0, 254);

  if (!email) {
    return NextResponse.json(
      { ok: false, message: "Email is required" },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  // Connect your newsletter provider here (e.g. Mailchimp, Resend). devLog only logs in development.
  devLog("[subscribe]", email);

  return NextResponse.json({ ok: true, message: "You’re subscribed!" });
}
