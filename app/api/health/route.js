import { NextResponse } from "next/server";
import dns from "node:dns/promises";
import { getDb, resolveMongoConnectionUri } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function maskUri(uri) {
  if (!uri) return null;
  try {
    return uri.replace(
      /^(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/,
      "$1$2:****@"
    );
  } catch {
    return "***";
  }
}

export async function GET(request) {
  const isProd = process.env.NODE_ENV === "production";
  const secret = (process.env.HEALTH_CHECK_SECRET || "").trim();
  const url = new URL(request.url);
  const provided =
    (request.headers.get("x-health-secret") || "").trim() ||
    (url.searchParams.get("secret") || "").trim();
  const verbose = Boolean(secret) && Boolean(provided) && secret === provided;

  if (isProd && !verbose) {
    try {
      const started = Date.now();
      const db = await getDb();
      await db.command({ ping: 1 });
      return NextResponse.json({
        ok: true,
        mongo: { connected: true, pingMs: Date.now() - started },
      });
    } catch {
      return NextResponse.json(
        { ok: false, mongo: { connected: false } },
        { status: 503 }
      );
    }
  }

  const uri = resolveMongoConnectionUri();
  const uriSafe = maskUri(uri);
  const isSrv = uri.startsWith("mongodb+srv://");

  const hostMatch = uri.match(/@([^/?]+)/);
  const host = hostMatch ? hostMatch[1] : null;

  const result = {
    ok: false,
    env: {
      hasUri: Boolean(uri),
      uri: uriSafe,
      db: process.env.MONGODB_DB || "listfy",
      isSrv,
      host,
    },
    dns: {
      servers: dns.getServers?.() || [],
      srv: null,
      a: null,
    },
    mongo: { connected: false, pingMs: null, error: null },
  };

  if (isSrv && host) {
    try {
      const srv = await dns.resolveSrv(`_mongodb._tcp.${host}`);
      result.dns.srv = srv.map((r) => `${r.name}:${r.port}`);
    } catch (err) {
      result.dns.srv = { error: err?.code || err?.message || String(err) };
    }
  }

  if (host) {
    try {
      const a = await dns.resolve4(host);
      result.dns.a = a;
    } catch (err) {
      result.dns.a = { error: err?.code || err?.message || String(err) };
    }
  }

  try {
    const started = Date.now();
    const db = await getDb();
    await db.command({ ping: 1 });
    result.mongo.connected = true;
    result.mongo.pingMs = Date.now() - started;

    try {
      const count = await db.collection("listings").countDocuments({});
      result.mongo.listingsCount = count;
    } catch {}

    result.ok = true;
  } catch (err) {
    result.mongo.error = {
      message: err?.message || String(err),
      code: err?.code || null,
      name: err?.name || null,
    };
  }

  return NextResponse.json(result, {
    status: result.ok ? 200 : 503,
  });
}
