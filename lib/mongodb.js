import { MongoClient } from "mongodb";
import dns from "node:dns";
import dnsPromises from "node:dns/promises";

const dbName = process.env.MONGODB_DB || "listfy";

if (!global._listfyDnsConfigured) {
  try {
    const extraServers = (process.env.MONGODB_DNS_SERVERS ||
      "8.8.8.8,1.1.1.1,8.8.4.4,1.0.0.1")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const current = dns.getServers ? dns.getServers() : [];
    const merged = Array.from(
      new Set([...extraServers, ...current.filter((s) => s !== "127.0.0.1")])
    );
    dns.setServers(merged);

    try {
      dns.setDefaultResultOrder?.("ipv4first");
    } catch {}

    console.log(
      "[mongodb] DNS resolvers configured:",
      dns.getServers().join(", ")
    );
  } catch (err) {
    console.warn(
      "[mongodb] could not override DNS servers:",
      err?.message || err
    );
  }

  global._listfyDnsConfigured = true;
}

function parseSrvUri(uri) {
  const match = uri.match(
    /^mongodb\+srv:\/\/(?:([^:]+):([^@]+)@)?([^/?]+)(\/([^?]*))?(\?(.*))?$/
  );
  if (!match) return null;

  const [, user, pass, host, , pathPart, , queryPart] = match;
  return {
    user: user ? decodeURIComponent(user) : null,
    pass: pass ? decodeURIComponent(pass) : null,
    host,
    pathPart: pathPart || "",
    queryPart: queryPart || "",
  };
}

async function resolveSrvWithFallback(host) {
  const tryResolvers = [
    dnsPromises.resolveSrv.bind(dnsPromises),
    async (name) => {
      const res = new dnsPromises.Resolver();
      res.setServers([
        ...(process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ]);
      return res.resolveSrv(name);
    },
  ];

  const tryTxt = [
    dnsPromises.resolveTxt.bind(dnsPromises),
    async (name) => {
      const res = new dnsPromises.Resolver();
      res.setServers([
        ...(process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ]);
      return res.resolveTxt(name);
    },
  ];

  let srv;
  let lastErr;
  for (const fn of tryResolvers) {
    try {
      srv = await fn(`_mongodb._tcp.${host}`);
      if (srv && srv.length > 0) break;
    } catch (err) {
      lastErr = err;
    }
  }
  if (!srv || srv.length === 0) {
    throw lastErr || new Error(`No SRV records for _mongodb._tcp.${host}`);
  }

  let txt = "";
  for (const fn of tryTxt) {
    try {
      const recs = await fn(host);
      txt = (recs || [])
        .map((r) => (Array.isArray(r) ? r.join("") : r))
        .join("&");
      if (txt) break;
    } catch {}
  }

  return { srv, txt };
}

async function buildNonSrvUriFromSrv(uri) {
  const parts = parseSrvUri(uri);
  if (!parts) throw new Error("Could not parse mongodb+srv URI");

  const { user, pass, host, pathPart, queryPart } = parts;

  const { srv, txt } = await resolveSrvWithFallback(host);

  const hosts = srv
    .map((r) => `${r.name}:${r.port || 27017}`)
    .join(",");

  const queryMap = new URLSearchParams(queryPart);

  if (txt) {
    const txtParams = new URLSearchParams(txt);
    txtParams.forEach((v, k) => {
      if (!queryMap.has(k)) queryMap.set(k, v);
    });
  }

  if (!queryMap.has("ssl") && !queryMap.has("tls")) queryMap.set("ssl", "true");
  if (!queryMap.has("authSource")) queryMap.set("authSource", "admin");
  if (!queryMap.has("retryWrites")) queryMap.set("retryWrites", "true");

  const credPart =
    user && pass
      ? `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@`
      : "";

  const pathSeg = pathPart ? `/${pathPart}` : "/";
  const qs = queryMap.toString();

  return `mongodb://${credPart}${hosts}${pathSeg}${qs ? `?${qs}` : ""}`;
}

async function createConnectedClient() {
  const origUri = process.env.MONGODB_URI;
  if (!origUri) {
    throw new Error(
      "Missing MONGODB_URI. Create .env.local in the project root and add your Atlas connection string (see .env.example). Then restart `npm run dev`."
    );
  }

  const options = {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    retryWrites: true,
  };

  const isSrv = origUri.startsWith("mongodb+srv://");

  if (!isSrv) {
    const client = new MongoClient(origUri, options);
    await client.connect();
    console.log("[mongodb] connected using plain mongodb:// URI");
    return client;
  }

  try {
    const client = new MongoClient(origUri, options);
    await client.connect();
    console.log("[mongodb] connected using mongodb+srv:// URI");
    return client;
  } catch (err) {
    const isDnsErr =
      err?.code === "ECONNREFUSED" ||
      err?.code === "ENOTFOUND" ||
      err?.code === "ETIMEOUT" ||
      err?.code === "ESERVFAIL" ||
      /querySrv|SRV record|TXT record/i.test(err?.message || "");

    if (!isDnsErr) throw err;

    console.warn(
      "[mongodb] mongodb+srv:// failed at SRV lookup (" +
        (err?.code || err?.message) +
        "), retrying with manually-resolved hosts…"
    );

    const resolvedUri = await buildNonSrvUriFromSrv(origUri);

    const safe = resolvedUri.replace(
      /^(mongodb:\/\/)([^:]+):([^@]+)@/,
      "$1$2:****@"
    );
    console.log("[mongodb] resolved non-SRV URI:", safe);

    const client = new MongoClient(resolvedUri, options);
    await client.connect();
    console.log("[mongodb] connected using manually-resolved mongodb:// URI");
    return client;
  }
}

let clientPromise;

function getClientPromise() {
  if (clientPromise) return clientPromise;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createConnectedClient().catch((err) => {
        global._mongoClientPromise = null;
        clientPromise = null;
        throw err;
      });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = createConnectedClient().catch((err) => {
      clientPromise = null;
      throw err;
    });
  }

  return clientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}

export default getClientPromise;
