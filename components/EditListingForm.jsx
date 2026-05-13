"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchableSelect } from "@/components/SearchableSelect";
import { Spinner } from "@/components/Spinner";
import { CATEGORIES as SHARED_CATEGORIES } from "@/lib/categories";
import { COUNTRIES, POPULAR_CITIES } from "@/lib/locations";
import { readJsonResponse } from "@/lib/readJsonResponse";

const ACCENT = "#2ed2c3";

export function EditListingForm({ id, slug, initial }) {
  const router = useRouter();
  const formRef = useRef(null);

  const [name, setName] = useState(initial.name);
  const [category, setCategory] = useState(initial.category);
  const [address, setAddress] = useState(initial.address);
  const [pincode, setPincode] = useState(initial.pincode);
  const [city, setCity] = useState(initial.city);
  const [country, setCountry] = useState(initial.country);
  const [services, setServices] = useState(initial.services);
  const [phone, setPhone] = useState(initial.phone);
  const [email, setEmail] = useState(initial.email);
  const [website, setWebsite] = useState(initial.website);
  const [description, setDescription] = useState(initial.description);
  const [imagePreview, setImagePreview] = useState(initial.image || "");
  const [previewFailed, setPreviewFailed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const allCategories = Array.from(new Set(SHARED_CATEGORIES));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewFailed(false);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result?.toString() || "");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter a business name.");
      return;
    }
    if (!category) {
      setErrorMessage("Please select a category.");
      return;
    }
    if (!address.trim()) {
      setErrorMessage("Please enter an address.");
      return;
    }

    const trimmedEmail = email.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid business email.");
      return;
    }

    const payload = {
      name: name.trim(),
      category,
      address: address.trim(),
      pincode: pincode.trim(),
      city: city.trim(),
      country: country.trim(),
      services: services.trim(),
      phone: phone.trim(),
      email: trimmedEmail,
      website: website.trim(),
      description: description.trim(),
      image: imagePreview || "",
    };

    setSubmitting(true);
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readJsonResponse(res);
      if (!res.ok || !data?.ok) {
        setErrorMessage(
          (typeof data?.message === "string" && data.message) ||
            (typeof data?.error === "string" && data.error) ||
            `Couldn't save changes (status ${res.status}).`
        );
        return;
      }
      const nextSlug = data?.listing?.slug || slug;
      setSuccessMessage("Listing updated successfully.");
      router.refresh();
      setTimeout(() => {
        if (nextSlug) {
          router.push(`/listing/${encodeURIComponent(nextSlug)}`);
        } else {
          router.push("/listings");
        }
      }, 800);
    } catch (err) {
      console.error("[edit-form] error:", err);
      setErrorMessage("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {errorMessage && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div
          role="status"
          className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {successMessage}
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-6 shadow-2xl sm:p-8 md:p-10"
        noValidate
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Business Name" required className="md:col-span-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Category" required className="md:col-span-2">
            <SearchableSelect
              value={category}
              onChange={setCategory}
              options={allCategories}
              placeholder="Select a category"
              searchPlaceholder="Search categories..."
              emptyLabel="categories"
              allowCustom={false}
              hiddenName="category"
              ariaLabel="Category"
            />
          </Field>

          <Field label="Phone">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Business Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@yourbusiness.com"
              autoComplete="email"
              className={inputClass}
            />
          </Field>

          <Field label="Address" className="md:col-span-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Pincode / Zip Code">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="City">
            <SearchableSelect
              value={city}
              onChange={setCity}
              options={POPULAR_CITIES}
              placeholder="Select or type a city"
              searchPlaceholder="Search cities..."
              emptyLabel="cities"
              allowCustom
              hiddenName="city"
              ariaLabel="City"
            />
          </Field>

          <Field label="Country">
            <SearchableSelect
              value={country}
              onChange={setCountry}
              options={COUNTRIES}
              placeholder="Select or type a country"
              searchPlaceholder="Search countries..."
              emptyLabel="countries"
              allowCustom
              hiddenName="country"
              ariaLabel="Country"
            />
          </Field>

          <Field label="Website URL">
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Services" hint="Separate with commas" className="md:col-span-2">
            <input
              type="text"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Business Image" className="md:col-span-2">
            <div className="flex min-w-0 flex-wrap items-center gap-4 sm:flex-nowrap">
              {imagePreview && !previewFailed && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- user preview (data URL / remote) */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 shrink-0 rounded-md object-cover ring-1 ring-zinc-200"
                    onError={() => setPreviewFailed(true)}
                  />
                </>
              )}
              {imagePreview && previewFailed && (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-[#2ed2c3]/10 text-lg font-semibold text-[#1fa99c] ring-1 ring-zinc-200">
                  {(name || "?").trim().charAt(0).toUpperCase()}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#2ed2c3] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#1fa99c]"
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview("");
                    setPreviewFailed(false);
                  }}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-800"
                >
                  Remove
                </button>
              )}
            </div>
          </Field>

          <Field label="Business Description" className="md:col-span-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={`${inputClass} h-auto resize-y py-3 leading-relaxed`}
            />
          </Field>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() =>
              slug
                ? router.push(`/listing/${encodeURIComponent(slug)}`)
                : router.push("/listings")
            }
            className="h-12 flex-1 rounded-md border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 flex-2 items-center justify-center gap-2 rounded-md text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            style={{ backgroundColor: ACCENT }}
          >
            {submitting && (
              <Spinner size="sm" color="#ffffff" trackOpacity={0.35} />
            )}
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
}

const inputClass =
  "block h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-200 focus:border-[#2ed2c3] focus:ring-2 focus:ring-[#2ed2c3]/30";

function Field({ label, required, hint, className = "", children }) {
  return (
    <div className={className}>
      <label className="mb-2 flex items-center justify-between text-sm font-medium text-zinc-800">
        <span>
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </span>
        {hint && <span className="text-xs font-normal text-zinc-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
