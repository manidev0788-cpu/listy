/**
 * Shared signup validation for `/api/auth/register` and the auth modal (client-safe).
 */

export const MAX_REGISTRATION_NAME_LENGTH = 120;
/** bcrypt ignores bytes beyond ~72 UTF-8 bytes; enforce a clear upper bound */
export const MAX_PASSWORD_UTF8_BYTES = 72;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function utf8ByteLength(str) {
  return new TextEncoder().encode(str).length;
}

export function isValidSignupEmail(email) {
  const s = (email ?? "").toString().trim().toLowerCase();
  return s.length > 0 && EMAIL_RE.test(s);
}

/**
 * Validates registration fields. Expects trimmed raw strings from forms.
 */
export function validateSignupFields({ name = "", email = "", password = "" }) {
  const trimmedName = name.toString().trim();
  const trimmedEmail = email.toString().trim().toLowerCase();
  const pw = password.toString();

  if (!trimmedEmail || !pw) {
    return { ok: false, message: "Email and password are required." };
  }

  if (!isValidSignupEmail(trimmedEmail)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  if (pw.length < 6) {
    return {
      ok: false,
      message: "Password must be at least 6 characters.",
    };
  }

  if (utf8ByteLength(pw) > MAX_PASSWORD_UTF8_BYTES) {
    return {
      ok: false,
      message: `Password must be at most ${MAX_PASSWORD_UTF8_BYTES} bytes (about 72 ASCII characters).`,
    };
  }

  if (trimmedName.length > MAX_REGISTRATION_NAME_LENGTH) {
    return {
      ok: false,
      message: `Name must be at most ${MAX_REGISTRATION_NAME_LENGTH} characters.`,
    };
  }

  return {
    ok: true,
    name: trimmedName,
    email: trimmedEmail,
    password: pw,
  };
}
