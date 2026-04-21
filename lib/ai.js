const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function toTitle(str) {
  return (str || "").replace(/\b\w/g, (c) => c.toUpperCase());
}

function mockContent(listing) {
  const name = listing?.name || "This business";
  const category = listing?.category || "local business";
  const city = listing?.city || "your area";
  const servicesList = (listing?.services || "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const title = `${name} | Trusted ${toTitle(category)} in ${toTitle(city)}`;

  const servicesSentence = servicesList.length
    ? `Our specialties include ${servicesList.slice(0, 4).join(", ")}. `
    : "";

  const description =
    `Looking for a reliable ${category.toLowerCase()} in ${city}? ${name} delivers professional, dependable service backed by years of hands-on experience and a commitment to customer satisfaction. ` +
    `${servicesSentence}` +
    `We combine transparent pricing, quick response times, and friendly, knowledgeable staff to make every interaction effortless. ` +
    `Whether you are a first-time client or a returning customer, our team listens to your needs and tailors each engagement to fit your goals. ` +
    `Discover why ${city} residents trust ${name} for ${category.toLowerCase()} services that stand out in quality, care, and consistency.`;

  const keywords = [
    category,
    `${category} in ${city}`,
    `best ${category.toLowerCase()} ${city}`,
    `${name} ${city}`,
    `top rated ${category.toLowerCase()}`,
    `${city} local services`,
    ...servicesList.slice(0, 4),
  ]
    .filter(Boolean)
    .slice(0, 10);

  return { title, description, keywords, source: "mock" };
}

export async function generateListingContent(listing) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return mockContent(listing);
  }

  const prompt = `Write SEO optimized landing page content for a business.

Business details:
- Name: ${listing?.name || "N/A"}
- Category: ${listing?.category || "N/A"}
- City: ${listing?.city || "N/A"}
- Services: ${listing?.services || "N/A"}
- Description: ${listing?.description || "N/A"}

Produce:
1. "title" - a compelling SEO H1 (max 70 chars) that mentions the business, category, and city.
2. "description" - 120 words, professional, benefits-focused, SEO optimized. Plain prose, no markdown.
3. "keywords" - an array of 8-10 relevant SEO keyword phrases (category + city variations, service keywords, long-tail phrases).

Respond with ONLY a JSON object with keys: title, description, keywords.`;

  try {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an SEO copywriter. Respond only with a valid JSON object matching the requested schema.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      console.error("[ai] openai non-ok:", res.status, await res.text());
      return mockContent(listing);
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) return mockContent(listing);

    const parsed = JSON.parse(raw);
    const title = parsed?.title || mockContent(listing).title;
    const description = parsed?.description || mockContent(listing).description;
    let keywords = parsed?.keywords;
    if (typeof keywords === "string") {
      keywords = keywords.split(",").map((k) => k.trim()).filter(Boolean);
    }
    if (!Array.isArray(keywords) || keywords.length === 0) {
      keywords = mockContent(listing).keywords;
    }

    return { title, description, keywords, source: "openai" };
  } catch (err) {
    console.error("[ai] generation error:", err);
    return mockContent(listing);
  }
}
