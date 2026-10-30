"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Flag,
  User,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarDays,
  AlignLeft,
  Building2,
  BedDouble,
  Phone,
  MessageCircle,
  UserRound,
  Users,
  Home,
} from "lucide-react";

/* ---------------------------------- Data ---------------------------------- */
/* Replace this object with data from your API / database. */

const property = {
  rent: "৳৯,০০০",
  unit: "/মাস",
  availableFrom: "১ ডিসেম্বর হতে",
  location: ["ঢাকা", "ধানমন্ডি", "ধানমন্ডি ৮/এ"],
  description:
    "নভেম্বর থেকে টাইলস করা ছুমছাম ও তলায় (লিফট-৪) ৫টি বড় মাস্টার বেডরুম, খোলামেলা রান্নাঘর এবং আলাদা বারান্দা সহ ফ্ল্যাটে একটি রুম সাবলেট দেওয়া হবে। আলো-বাতাসপূর্ণ শান্ত ও নিরিবিলি পরিবেশ। লাইনের গ্যাস, পানি এবং জেনারেটরের ব্যাকআপ সুবিধা রয়েছে।",
  propertyType: "সাবলেট / ১ রুম ভাড়া (Sublet - 1 Room)",
  tenantTypes: [
    { key: "male", label: "পুরুষ (Male)", Icon: UserRound },
    { key: "female", label: "মহিলা (Female)", Icon: User },
    { key: "family", label: "ফ্যামিলি / যে কেউ", Icon: Users },
  ],
  acceptedTenant: "female",
  host: { name: "Tajbir Islam", initials: "TI", online: true },
  phone: "+8801XXXXXXXXX",
  whatsapp: "8801XXXXXXXXX",
  images: [
    "https://picsum.photos/seed/prop-1/1200/800",
    "https://picsum.photos/seed/prop-2/1200/800",
    "https://picsum.photos/seed/prop-3/1200/800",
    "https://picsum.photos/seed/prop-4/1200/800",
    "https://picsum.photos/seed/prop-5/1200/800",
    "https://picsum.photos/seed/prop-6/1200/800",
  ],
};

/* Hides the scrollbar but keeps scrolling (mouse wheel, touch, keyboard) */
const noScrollbar =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

/* ------------------------------- Small parts ------------------------------- */

const SectionTitle = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <h2 className="flex items-center gap-2.5 text-base font-extrabold text-slate-900">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      {icon}
    </span>
    {children}
  </h2>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200/60 sm:p-5">
    {children}
  </section>
);

const Gallery = () => {
  const [index, setIndex] = useState(0);
  const total = property.images.length;
  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  const arrow =
    "absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white";

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 sm:aspect-[16/9] lg:rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.images[index]}
          alt={`ছবি ${index + 1}`}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

        <button type="button" onClick={prev} aria-label="আগের ছবি" className={`${arrow} left-3`}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={next} aria-label="পরের ছবি" className={`${arrow} right-3`}>
          <ChevronRight className="h-5 w-5" />
        </button>

        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white">
          <Camera className="h-3.5 w-3.5" />
          {index + 1}/{total} ছবি
        </span>
      </div>

      {/* Thumbnails: tablet and desktop */}
      <div className={`mt-3 hidden gap-2 overflow-x-auto px-px sm:flex ${noScrollbar}`}>
        {property.images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`ছবি ${i + 1} দেখুন`}
            className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition lg:h-[72px] lg:w-28 ${
              i === index
                ? "border-blue-600"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

const PriceCards = () => (
  <div className="grid grid-cols-2 gap-3">
    <div className="rounded-xl bg-blue-50 p-3 sm:p-4">
      <p className="text-[11px] font-semibold text-slate-500">মাসিক ভাড়া</p>
      <p className="mt-1.5 text-2xl font-extrabold leading-none text-blue-600 sm:text-[26px]">
        {property.rent}
        <span className="ml-0.5 text-xs font-medium text-slate-400">{property.unit}</span>
      </p>
    </div>
    <div className="rounded-xl bg-blue-50 p-3 sm:p-4">
      <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
        <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
        কবে থেকে উঠতে পারবেন
      </p>
      <span className="mt-1.5 inline-block rounded-md border border-blue-100 bg-white px-2 py-1 text-xs font-bold text-blue-600">
        {property.availableFrom}
      </span>
    </div>
  </div>
);

const HostRow = () => (
  <div className="flex items-center gap-3">
    <div className="relative">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
        {property.host.initials}
      </div>
      {property.host.online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
      )}
    </div>
    <div className="min-w-0 leading-tight">
      <p className="truncate text-sm font-bold text-slate-900">{property.host.name}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">বাড়ির মালিক / পোস্টদাতা</p>
    </div>
  </div>
);

const ContactButtons = ({ stacked = false }: { stacked?: boolean }) => (
  <div className={stacked ? "grid gap-2.5" : "grid grid-cols-2 gap-3"}>
    <a
      href={`https://wa.me/${property.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-bold text-white shadow-md shadow-emerald-500/25 transition hover:bg-emerald-600"
    >
      <MessageCircle className="h-4 w-4 fill-white" />
      হোয়াটসঅ্যাপ
    </a>
    <a
      href={`tel:${property.phone}`}
      className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
    >
      <Phone className="h-4 w-4 fill-white" />
      সরাসরি কল
    </a>
  </div>
);

/* ---------------------------------- Page ---------------------------------- */

const PropertyDetailsPage = () => {
  return (
    <main className="bg-slate-50 pb-24 lg:pb-12">
      {/* Mobile app bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-3 py-2.5 lg:hidden">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="ফিরে যান" className="text-slate-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-sm font-bold text-slate-900">Property Details</h1>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <button type="button" aria-label="শেয়ার">
            <Share2 className="h-[18px] w-[18px]" />
          </button>
          <button type="button" aria-label="রিপোর্ট">
            <Flag className="h-[18px] w-[18px]" />
          </button>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
            <User className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Normal page scroll; on desktop the right card stays in place */}
      <div className="mx-auto max-w-6xl lg:px-8">
        {/* Desktop top row */}
        <div className="hidden items-center justify-between py-4 lg:flex">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            সব লিস্টিংয়ে ফিরে যান
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:text-blue-600"
            >
              <Share2 className="h-4 w-4" /> শেয়ার
            </button>
            <button
              type="button"
              className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:text-red-500"
            >
              <Flag className="h-4 w-4" /> রিপোর্ট
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-6">
          {/* Left column: shows all the details */}
          <div className="min-w-0">
            <Gallery />

            <div className="space-y-4 px-3 pt-4 sm:px-6 lg:px-0">
              {/* Location */}
              <p className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
                <MapPin className="h-4 w-4 fill-blue-600 text-white" />
                {property.location.map((part, i) => (
                  <span key={part} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight className="h-3 w-3 text-slate-300" />}
                    <span
                      className={
                        i === property.location.length - 1 ? "font-bold text-slate-800" : ""
                      }
                    >
                      {part}
                    </span>
                  </span>
                ))}
              </p>

              {/* Mobile / tablet: price + host (desktop shows these in the right pane) */}
              <div className="space-y-4 lg:hidden">
                <PriceCards />
                <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm shadow-slate-200/60">
                  <HostRow />
                </div>
              </div>

              {/* Description */}
              <Card>
                <SectionTitle icon={<AlignLeft className="h-4 w-4" />}>
                  সংক্ষিপ্ত বিবরণ
                </SectionTitle>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {property.description}
                </p>
              </Card>

              {/* Property + tenant type */}
              <Card>
                <SectionTitle icon={<Building2 className="h-4 w-4" />}>
                  বাসার ধরন ও ভাড়াটিয়া
                </SectionTitle>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      বাসার ধরন (Property Type)
                    </p>
                    <div className="mt-2 inline-flex max-w-full items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 sm:text-sm">
                      <BedDouble className="h-4 w-4 shrink-0" />
                      <span>{property.propertyType}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold text-slate-500">
                      ভাড়াটিয়ার ধরন (কারা উঠতে পারবেন)
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:max-w-lg">
                      {property.tenantTypes.map(({ key, label, Icon }) => {
                        const active = key === property.acceptedTenant;
                        return (
                          <div
                            key={key}
                            className={`relative flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-center text-[11px] font-bold sm:text-xs ${
                              active
                                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                : "border-slate-200 bg-slate-50 text-slate-400"
                            }`}
                          >
                            {active && (
                              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-blue-600">
                                <Check className="h-3 w-3" strokeWidth={3} />
                              </span>
                            )}
                            <Icon className="h-[18px] w-[18px]" />
                            {label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right column (desktop only): stays in place while the page scrolls */}
          <aside className="hidden lg:sticky lg:top-20 lg:block">
            <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/60">
              <PriceCards />
              <div className="border-t border-slate-100 pt-4">
                <HostRow />
              </div>
              <ContactButtons stacked />
              <p className="flex items-start gap-2 border-t border-slate-100 pt-4 text-[11px] leading-5 text-slate-400">
                <Home className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                কল করার সময় জানাবেন যে আপনি Dhanmondi Rooms থেকে দেখেছেন।
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile / tablet fixed contact bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white p-3 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] lg:hidden">
        <div className="mx-auto max-w-2xl">
          <ContactButtons />
        </div>
      </div>
    </main>
  );
};

export default PropertyDetailsPage;