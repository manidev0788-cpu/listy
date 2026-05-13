/**
 * Ensures helpful indexes once per server runtime (handles failures without blocking APIs).
 */

let ensuredPromise;

export function ensureListingIndexes(db) {
  if (!ensuredPromise) {
    ensuredPromise = (async () => {
      const col = db.collection("listings");

      try {
        await col.createIndex(
          { slug: 1 },
          {
            unique: true,
            partialFilterExpression: {
              slug: { $type: "string", $gt: "" },
            },
          }
        );
      } catch (err) {
        console.error(
          "[listings] slug unique index (may need duplicate cleanup):",
          err?.message || err
        );
      }

      try {
        await col.createIndex({ createdAt: -1 });
      } catch (err) {
        console.error("[listings] createdAt index:", err?.message || err);
      }

      try {
        await col.createIndex({ userId: 1, createdAt: -1 });
      } catch (err) {
        console.error("[listings] userId index:", err?.message || err);
      }

      try {
        await col.createIndex({ category: 1, createdAt: -1 });
      } catch (err) {
        console.error("[listings] category index:", err?.message || err);
      }

      try {
        await col.createIndex({ city: 1, createdAt: -1 });
      } catch (err) {
        console.error("[listings] city index:", err?.message || err);
      }
    })();
  }

  return ensuredPromise;
}
