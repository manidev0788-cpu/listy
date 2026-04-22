import { NextResponse } from "next/server";

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const message = String(body?.message || "").trim();

  if (name.length < 2) {
    return NextResponse.json(
      { ok: false, message: "Please enter your name (at least 2 characters)." },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (message.length < 10) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please enter a message (at least 10 characters).",
      },
      { status: 400 }
    );
  }

  console.log("[contact]", { name, email, messageLen: message.length });

  return NextResponse.json({
    ok: true,
    message: "Thanks — we received your message and will get back to you soon.",
  });
}
