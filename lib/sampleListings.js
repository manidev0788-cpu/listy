import { createSlug } from "@/lib/slug";

const raw = [
  {
    name: "Abhinav Immigration Services",
    category: "Immigration",
    address: "Sector 62, Noida",
    pincode: "201309",
    city: "Noida",
    country: "India",
    services: "Visa Consultation, PR, Study Abroad, Work Permit",
    phone: "+91 120 456 7890",
    website: "https://abhinav.com",
    description:
      "Trusted immigration consultants helping thousands relocate for studies, work and permanent residency across Canada, Australia, UK and USA.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "The Coffee Corner",
    category: "Cafes",
    address: "221 Baker Street",
    pincode: "10001",
    city: "New York",
    country: "United States",
    services: "Dine-in, Takeout, Espresso, Pastries",
    phone: "+1 212 555 0144",
    website: "https://thecoffeecorner.example",
    description:
      "Cozy neighborhood cafe serving single-origin espresso, fresh pastries and all-day breakfast classics.",
    image:
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Golden Spoon Restaurant",
    category: "Restaurants",
    address: "12 Marine Drive",
    pincode: "400020",
    city: "Mumbai",
    country: "India",
    services: "Dine-in, Takeout, Delivery, Private Dining",
    phone: "+91 22 6611 2020",
    website: "https://goldenspoon.example",
    description:
      "Award-winning multi-cuisine restaurant with a stunning seafront view, curated wine list and live acoustic nights.",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sunrise Auto Repair",
    category: "Auto Repair",
    address: "88 Industrial Way",
    pincode: "90001",
    city: "Los Angeles",
    country: "United States",
    services: "Oil Change, Brake Service, Diagnostics, Tires",
    phone: "+1 323 555 0199",
    website: "https://sunriseauto.example",
    description:
      "Full-service auto repair shop with ASE-certified technicians, honest pricing and a lifetime workmanship guarantee.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Bella Luna Salon & Spa",
    category: "Beauty & Spas",
    address: "45 Orchard Road",
    pincode: "238877",
    city: "Singapore",
    country: "Singapore",
    services: "Hair, Facial, Massage, Bridal, Nails",
    phone: "+65 6555 1234",
    website: "https://bellaluna.example",
    description:
      "Luxury salon and day spa offering relaxing treatments, expert hairstyling and bridal packages in the heart of Orchard.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Skyline Hotel & Suites",
    category: "Hotels",
    address: "500 Sheikh Zayed Rd",
    pincode: "00000",
    city: "Dubai",
    country: "United Arab Emirates",
    services: "Luxury Rooms, Rooftop Pool, Spa, Fine Dining",
    phone: "+971 4 555 1000",
    website: "https://skylinehotel.example",
    description:
      "5-star luxury hotel with panoramic skyline views, a world-class spa and three signature restaurants.",
    image:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "GreenLeaf Real Estate",
    category: "Real Estate Agents",
    address: "Connaught Place",
    pincode: "110001",
    city: "New Delhi",
    country: "India",
    services: "Residential, Commercial, Rentals, Investment",
    phone: "+91 11 4567 8901",
    website: "https://greenleaf.example",
    description:
      "Delhi's trusted real estate advisors with 15+ years of experience in premium residential and commercial properties.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "FitZone Gym",
    category: "Gyms",
    address: "221B Collins Street",
    pincode: "3000",
    city: "Melbourne",
    country: "Australia",
    services: "CrossFit, Personal Training, Yoga, Nutrition",
    phone: "+61 3 9555 2020",
    website: "https://fitzone.example",
    description:
      "Modern 24/7 fitness club with top-tier equipment, expert trainers and group classes for every level.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "BrightSmile Dental Clinic",
    category: "Dentists",
    address: "77 Queen Street",
    pincode: "M5H 2M8",
    city: "Toronto",
    country: "Canada",
    services: "Cleaning, Whitening, Orthodontics, Implants",
    phone: "+1 416 555 0177",
    website: "https://brightsmile.example",
    description:
      "Gentle family dentistry with modern technology, same-day emergency appointments and transparent pricing.",
    image:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pixel Perfect Web Studio",
    category: "Web Design",
    address: "10 Shoreditch High St",
    pincode: "E1 6PG",
    city: "London",
    country: "United Kingdom",
    services: "Web Design, Branding, SEO, E-commerce",
    phone: "+44 20 7555 1000",
    website: "https://pixelperfect.example",
    description:
      "Award-winning web design studio building fast, beautiful and conversion-focused sites for ambitious brands.",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sakura Sushi Bar",
    category: "Sushi Bars",
    address: "3-1 Shibuya",
    pincode: "150-0002",
    city: "Tokyo",
    country: "Japan",
    services: "Omakase, Sushi, Sake, Takeaway",
    phone: "+81 3 5555 1001",
    website: "https://sakurasushi.example",
    description:
      "Authentic Edo-style sushi bar helmed by a third-generation chef, serving premium omakase and seasonal specials.",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mountain Trail Tours",
    category: "Tours",
    address: "Plaza Mayor 10",
    pincode: "28012",
    city: "Madrid",
    country: "Spain",
    services: "Hiking Tours, City Walks, Food Tours, Private Guides",
    phone: "+34 91 555 2020",
    website: "https://mountaintrail.example",
    description:
      "Small-group adventure and cultural tours led by passionate local guides across Spain's most iconic landscapes.",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
  },
];

const baseDate = new Date("2024-09-01T00:00:00Z").getTime();

export const SAMPLE_LISTINGS = raw.map((item, idx) => {
  const slug = createSlug(item.name, item.city) || `listing-${idx + 1}`;
  return {
    _id: `sample-${idx + 1}`,
    ...item,
    slug,
    createdAt: new Date(baseDate + idx * 86400000).toISOString(),
    isSample: true,
  };
});

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function filterSampleListings({
  search = "",
  location = "",
  city = "",
  category = "",
} = {}) {
  let out = SAMPLE_LISTINGS.slice();

  if (search) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    out = out.filter(
      (l) =>
        rx.test(l.name || "") ||
        rx.test(l.category || "") ||
        rx.test(l.services || "") ||
        rx.test(l.description || "")
    );
  }

  if (location) {
    const rx = new RegExp(escapeRegex(location.trim()), "i");
    out = out.filter(
      (l) =>
        rx.test(l.city || "") ||
        rx.test(l.country || "") ||
        rx.test(l.address || "") ||
        rx.test(l.pincode || "")
    );
  }

  if (city) {
    const rx = new RegExp(escapeRegex(city.trim()), "i");
    out = out.filter((l) => rx.test(l.city || ""));
  }

  if (category) {
    const rx = new RegExp(escapeRegex(category.trim()), "i");
    out = out.filter((l) => rx.test(l.category || ""));
  }

  return out;
}

export function findSampleBySlug(slug) {
  return SAMPLE_LISTINGS.find((l) => l.slug === slug) || null;
}
