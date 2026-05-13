import { NextResponse } from "next/server";
import { devLog } from "@/lib/devLog";

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const MAX_CONTACT_NAME = 200;
const MAX_CONTACT_MESSAGE = 8000;

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

  const rawMessage = String(body?.message ?? "");
  if (rawMessage.length > MAX_CONTACT_MESSAGE) {
    return NextResponse.json(
      { ok: false, message: "Message is too long." },
      { status: 400 }
    );
  }

  const name = String(body?.name || "")
    .trim()
    .slice(0, MAX_CONTACT_NAME);
  const email = String(body?.email || "").trim().toLowerCase().slice(0, 254);
  const message = rawMessage.trim().slice(0, MAX_CONTACT_MESSAGE);

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

  devLog("[contact]", { name, email, messageLen: message.length });

  return NextResponse.json({
    ok: true,
    message: "Thanks — we received your message and will get back to you soon.",
  });
}
