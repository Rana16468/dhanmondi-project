"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Camera, ChevronLeft, ChevronRight, CircleCheck, CirclePlus, Clock, Compass,
  Eye, Home, MapPin, Megaphone, Pencil, Phone, Trash2, User, Zap,
} from "lucide-react";

/* ---------- types & sample data (replace with your API / store later) ---------- */

type Listing = {
  id: string;
  owner: string;
  postedAgo: string;
  tenantLabel: string;
  location: string[];
  description: string;
  images: string[];
  views: number;
  rent: number;
  availableFrom: string;
};

const USER = { name: "Zain Raihan Sahed", phone: "+880 1712-345678" };

const INITIAL_LISTINGS: Listing[] = [
  {
    id: "l1",
    owner: "আরিফুল ইসলাম",
    postedAgo: "1h ago",
    tenantLabel: "ফ্যামিলি বাসা",
    location: ["Dhaka", "Dhanmondi", "Road 15"],
    description:
      "ধানমন্ডি ১৫ নম্বর মেইন রোডের নিকটে ৩ রুমের নিরিবিলি মনোরম পরিবেশের সম্পূর্ণ টাইলসকৃত দক্ষিণমুখী ফ্ল্যাট। সার্বক্ষণিক লিফট, জেনারেটর, সিকিউরিটি গার্ড এবং গ্যাস সুবিধা রয়েছে।",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=70",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=70",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=70",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=70",
    ],
    views: 1240,
    rent: 22000,
    availableFrom: "১ নভেম্বর হতে",
  },
];

const bn = (v: number | string) => String(v).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const taka = (n: number) => "৳" + bn(n.toLocaleString("en-US"));
const DESC_LIMIT = 130;

/* ---------- pieces ---------- */

function ProfileCard() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:gap-3 md:p-3.5">
      <div className="relative shrink-0">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-indigo-50 text-slate-600 md:h-12 md:w-12">
          <User size={28} className="md:h-6 md:w-6" />
        </span>
        <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-700" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-lg font-semibold text-slate-900 md:text-[15px]">{USER.name}</p>
        <p className="text-[13px] text-slate-500 md:text-[12px]">{USER.phone}</p>
      </div>
    </div>
  );
}

function PromoCard() {
  const points = [
    { icon: Zap, text: "২৪-৪৮ ঘণ্টার মধ্যে জেনুইন ভাড়াটিয়া পাওয়ার সুযোগ" },
    { icon: Phone, text: "সরাসরি কল ও হোয়াটসঅ্যাপে কথা বলুন — ০% ব্রোকার ফি" },
    { icon: CircleCheck, text: "সহজ ও ঝামেলামুক্ত লিস্টিং" },
  ];
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-lg shadow-blue-700/20 md:p-4">
      <h2 className="text-[19px] font-extrabold leading-snug md:text-[16px]">বাসা বা মেস দ্রুত ভাড়া দিতে চান?</h2>
      <p className="mt-1 text-[13px] leading-relaxed text-blue-100 md:text-[12px]">
        MyRoom-এ বিজ্ঞাপন দিয়ে সহজেই খুঁজে নিন পছন্দের ভেরিফায়েড ভাড়াটিয়া
      </p>

      <ul className="mt-4 space-y-3 rounded-xl border border-white/20 bg-white/10 p-3.5 md:space-y-2.5 md:p-3">
        {points.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 text-[13px] font-medium leading-snug md:gap-2.5 md:text-[12px]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/20 md:h-7 md:w-7">
              <Icon size={15} className="md:h-3.5 md:w-3.5" />
            </span>
            <span className="pt-1 md:pt-0.5">{text}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/post-ad"
        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-white py-3 text-[14px] font-bold text-blue-700 shadow transition hover:bg-blue-50 md:py-2.5 md:text-[13px]"
      >
        <CirclePlus size={20} /> + আপনার বাসা লিস্ট করুন (সম্পূর্ণ ফ্রি)
      </Link>
    </div>
  );
}

function ListingCard({ item, onDelete }: { item: Listing; onDelete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const total = item.images.length;
  const long = item.description.length > DESC_LIMIT;
  const shownDesc = long && !expanded ? item.description.slice(0, DESC_LIMIT).trimEnd() + "… " : item.description + " ";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:grid md:grid-cols-[220px_1fr] md:gap-x-4 md:p-4">
      {/* owner row */}
      <div className="flex items-start justify-between gap-3 md:col-start-2">
        <div className="flex items-center gap-3 md:gap-2.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-700 text-lg font-bold text-white md:h-9 md:w-9 md:text-base">
            {item.owner.charAt(0)}
          </span>
          <div className="leading-tight">
            <p className="text-[16px] font-bold text-slate-900 md:text-[14px]">{item.owner}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[12px] text-slate-500 md:text-[11px]">
              <Clock size={13} /> Posted {item.postedAgo}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[12px] font-semibold text-blue-600 md:px-2.5 md:text-[11px]">
          {item.tenantLabel}
        </span>
      </div>

      {/* location */}
      <p className="mt-3 flex flex-wrap items-center gap-1 text-[13px] text-slate-500 md:col-start-2 md:mt-2 md:text-[12px]">
        <MapPin size={15} className="mr-0.5 text-blue-600" />
        {item.location.map((part, i) => (
          <span key={part} className="flex items-center gap-1">
            {i > 0 && <span>›</span>}
            <span className={i === item.location.length - 1 ? "font-semibold text-slate-800" : ""}>{part}</span>
          </span>
        ))}
      </p>

      {/* description */}
      <p className="mt-2.5 text-[14px] leading-relaxed text-slate-800 md:col-start-2 md:text-[13px]">
        {shownDesc}
        {long && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="font-semibold text-blue-600 hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      {/* gallery */}
      <div className="relative mt-3.5 aspect-[3/2] overflow-hidden rounded-xl bg-slate-200 md:col-start-1 md:row-span-5 md:row-start-1 md:mt-0 md:aspect-[4/5] md:self-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.images[idx]} alt={`${item.owner} – ছবি ${idx + 1}`} className="h-full w-full object-cover" />

        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur md:right-2 md:top-2 md:px-2 md:py-0.5 md:text-[10px]">
          <Eye size={14} /> {item.views.toLocaleString("en-US")} views
        </span>

        {idx > 0 && (
          <button
            aria-label="আগের ছবি"
            onClick={() => setIdx((i) => i - 1)}
            className="absolute left-3 top-1/2 grid h-9 w-9 md:left-2 md:h-7 md:w-7 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow hover:bg-white"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {idx < total - 1 && (
          <button
            aria-label="পরের ছবি"
            onClick={() => setIdx((i) => i + 1)}
            className="absolute right-3 top-1/2 grid h-9 w-9 md:right-2 md:h-7 md:w-7 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow hover:bg-white"
          >
            <ChevronRight size={18} />
          </button>
        )}

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur md:bottom-2 md:left-2 md:px-2 md:py-0.5 md:text-[10px]">
          <Camera size={14} /> {idx + 1} / {total}
        </span>
      </div>

      {/* rent */}
      <div className="mt-4 flex items-end justify-between gap-3 border-b border-slate-100 pb-4 md:col-start-2 md:mt-3 md:pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:text-[10px]">Rent</p>
          <p className="text-2xl font-extrabold text-slate-900 md:text-xl">
            {taka(item.rent)} <span className="text-[13px] font-medium text-slate-500">/ মাস</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:text-[10px]">Available from</p>
          <span className="mt-1 inline-block rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[12px] font-semibold text-blue-600 md:px-2.5 md:text-[11px]">
            {item.availableFrom}
          </span>
        </div>
      </div>

      {/* actions */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:col-start-2 md:mt-3 md:gap-2.5">
        <Link
          href="/post-ad"
          className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-[13px] font-semibold text-blue-700 transition hover:bg-blue-100 md:py-2 md:text-[12px]"
        >
          <Pencil size={16} /> Edit Listing
        </Link>
        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-[13px] font-semibold text-red-600 transition hover:bg-red-100 md:py-2 md:text-[12px]"
        >
          <Trash2 size={16} /> Delete Listing
        </button>
      </div>
    </article>
  );
}

/* ---------- page ---------- */

const page = () => {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!deleteId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDeleteId(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [deleteId]);

  const confirmDelete = () => {
    // TODO: call your delete API here
    setListings((prev) => prev.filter((l) => l.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 text-slate-900 lg:h-screen lg:overflow-hidden lg:pb-0">
      {/* ===== top bar ===== */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6 lg:h-16 lg:max-w-5xl">
          <div className="flex items-center gap-3">
            <button aria-label="ফিরে যান" onClick={() => router.back()} className="rounded-full p-1.5 hover:bg-slate-100">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-lg font-semibold md:text-base">Account</h1>
          </div>

          {/* desktop quick links */}
          <nav className="hidden items-center gap-2 lg:flex">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Compass size={17} className="text-blue-700" /> বাসা খুঁজুন
            </Link>
            <Link
              href="/post-ad"
              className="flex items-center gap-2 rounded-lg bg-blue-700 px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-blue-800"
            >
              <Megaphone size={17} /> বিজ্ঞাপন দিন
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-[14px] font-semibold text-blue-700 hover:underline md:text-[13px]">
              <Pencil size={16} /> Edit
            </button>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-700 text-white">
              <User size={20} />
            </span>
          </div>
        </div>
      </header>

      {/* ===== content ===== */}
      <main className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:grid lg:h-[calc(100vh-4rem)] lg:max-w-5xl lg:grid-cols-12 lg:grid-rows-1 lg:gap-6 lg:overflow-hidden lg:py-6">
        <aside className="space-y-5 lg:col-span-4 lg:min-h-0 lg:space-y-4 lg:overflow-y-auto">
          <ProfileCard />
          <PromoCard />
        </aside>

        <section className="mt-7 lg:col-span-8 lg:mt-0 lg:min-h-0 lg:overflow-y-auto lg:pr-1 lg:[scrollbar-width:thin]">
          <div className="mb-4 flex items-center justify-between gap-3 lg:sticky lg:top-0 lg:z-10 lg:mb-0 lg:bg-slate-50 lg:pb-3">
            <h2 className="text-xl font-semibold sm:text-2xl md:text-lg">
              Active Listings <span className="text-[13px] font-normal text-slate-500 md:text-[12px]">(চলমান লিস্টিং)</span>
            </h2>
            <span className="rounded-full bg-slate-200/70 px-3 py-1 text-[12px] font-semibold text-slate-600">
              {listings.length} Total
            </span>
          </div>

          {listings.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-blue-600">
                <Home size={26} />
              </span>
              <p className="mt-3 text-[15px] font-semibold">কোনো চলমান লিস্টিং নেই</p>
              <p className="mt-1 text-[13px] text-slate-500">আপনার বাসা ফ্রিতে লিস্ট করে ভাড়াটিয়া খুঁজুন।</p>
              <Link
                href="/post-ad"
                className="mt-4 rounded-full bg-blue-700 px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-blue-800"
              >
                বিজ্ঞাপন দিন
              </Link>
            </div>
          ) : (
            <div className="space-y-5 lg:space-y-4 lg:pb-6">
              {listings.map((item) => (
                <ListingCard key={item.id} item={item} onDelete={() => setDeleteId(item.id)} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ===== floating bottom nav (mobile & tablet) ===== */}
      <nav className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-2 shadow-xl lg:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Link href="/" className="flex items-center justify-center gap-3 rounded-xl bg-blue-700 px-3 py-2.5 text-white">
            <Compass size={22} />
            <span className="leading-tight">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-blue-200">Explore</span>
              <span className="block text-[14px] font-bold">বাসা খুঁজুন</span>
            </span>
          </Link>
          <Link href="/post-ad" className="flex items-center justify-center gap-3 rounded-xl bg-indigo-50 px-3 py-2.5 text-slate-800">
            <Megaphone size={22} className="text-blue-700" />
            <span className="leading-tight">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Free post</span>
              <span className="block text-[14px] font-bold">বিজ্ঞাপন দিন</span>
            </span>
          </Link>
        </div>
      </nav>

      {/* ===== delete confirm ===== */}
      {deleteId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setDeleteId(null)}>
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={20} />
            </span>
            <h3 className="mt-3 text-[16px] font-bold">লিস্টিং মুছে ফেলবেন?</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
              এই বিজ্ঞাপনটি মুছে ফেললে আর ফিরিয়ে আনা যাবে না।
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-slate-300 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 py-2.5 text-[13px] font-semibold text-white hover:bg-red-700"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;