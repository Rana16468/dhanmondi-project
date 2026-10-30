"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import locationsData from "../src/utility/locations..json";
import {
  MapPin,
  Search,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  RefreshCw,
  CalendarDays,
  Wallet,
  X,
  Compass,
  BadgeCheck,
} from "lucide-react";
import ListingCard from "@/src/components/pages/ListingCard";

/* ---------------------------------- Types --------------------------------- */

type TenantKey = "any" | "family" | "bachelor" | "female";

type Listing = {
  id: number;
  name: string;
  verified?: boolean;
  posted: string;
  badge: string;
  badgeClass: string;
  road: string;
  description: string;
  images: string[];
  rent: string;
  rentValue: number; // numeric rent, used for sorting + budget filter
  unit: string;
  availableDate: string; // ISO "YYYY-MM-DD" — shown as a formatted date + used for date filter
  availableClass: string;
  tenant: TenantKey;
};

type SortKey = "newest" | "price-asc" | "price-desc" | "verified";

type Filters = {
  tenant: TenantKey | "all";
  minRent: number;
  maxRent: number;
  fromDate: string;
  toDate: string;
};

/* ---------------------------------- Data ---------------------------------- */

const BLUE_TAG = "bg-blue-50 text-blue-600 border-blue-100";
const GREEN_TAG = "bg-emerald-50 text-emerald-600 border-emerald-100";

const BUDGET_MIN = 0;
const BUDGET_MAX = 150000;
const BUDGET_STEP = 1000;

/* The array is ordered newest first, so "newest" simply keeps this order. */
const listings: Listing[] = [
  {
    id: 1,
    name: "জাহিদুল ইসলাম",
    posted: "Posted 2h ago",
    badge: "ব্যাচেলর বাসা",
    badgeClass: BLUE_TAG,
    road: "Road 27",
    description:
      "ধানমন্ডি ২৭ নম্বরে ডিসেম্বর মাস থেকে ৩ রুম, ২ বাথরুম বিশিষ্ট সুন্দর ফ্ল্যাট ভাড়া দেওয়া হবে। ফ্যামিলি বা ছোট ফ্যামিলির জন্য সম্পূর্ণ উপযোগী। গ্যাস ও লিফট সুবিধা আছে।",
    images: [
      "https://picsum.photos/seed/dhanmondi-1/700/500",
      "https://picsum.photos/seed/dhanmondi-1b/700/500",
      "https://picsum.photos/seed/dhanmondi-1c/700/500",
    ],
    rent: "৳২২,০০০",
    rentValue: 22000,
    unit: "/ মাস",
    availableDate: "2026-12-01",
    availableClass: BLUE_TAG,
    tenant: "bachelor",
  },
  {
    id: 2,
    name: "সাইফুল ইসলাম চৌধুরী",
    posted: "Posted 5h ago",
    badge: "ফ্যামিলি বাসা",
    badgeClass: BLUE_TAG,
    road: "Road 9A",
    description:
      "ধানমন্ডি ৯/এ রোডে ১১০০ স্কয়ার ফিটের ৩ বেডরুমের ফ্ল্যাট। নিরিবিলি পরিবেশ, ২৪ ঘণ্টা নিরাপত্তা, জেনারেটর ও লিফট সুবিধা রয়েছে। সরাসরি মালিকের সাথে যোগাযোগ করুন।",
    images: [
      "https://picsum.photos/seed/dhanmondi-2/700/500",
      "https://picsum.photos/seed/dhanmondi-2b/700/500",
    ],
    rent: "৳১৮,৫০০",
    rentValue: 18500,
    unit: "/ মাস",
    availableDate: "2027-01-01",
    availableClass: BLUE_TAG,
    tenant: "family",
  },
  {
    id: 3,
    name: "আরিফ আহমেদ",
    posted: "Posted 9h ago",
    badge: "ছাত্রদের জন্য",
    badgeClass: GREEN_TAG,
    road: "Shankar / Road 15",
    description:
      "ধানমন্ডি শংকর এলাকায় ছাত্র ও চাকরিজীবীদের জন্য সিট ভাড়া হবে। বিশ্ববিদ্যালয় ও কোচিং সেন্টারের কাছে, বাজার ও যাতায়াত সুবিধা চমৎকার।",
    images: [
      "https://picsum.photos/seed/dhanmondi-3/700/500",
      "https://picsum.photos/seed/dhanmondi-3b/700/500",
    ],
    rent: "৳৪,৫০০",
    rentValue: 4500,
    unit: "/ সিট",
    availableDate: "2026-11-01",
    availableClass: GREEN_TAG,
    tenant: "female",
  },
  {
    id: 4,
    name: "Tajbir Islam",
    verified: true,
    posted: "Posted 1d ago",
    badge: "সাবলেট / শেয়ারিং",
    badgeClass: GREEN_TAG,
    road: "Road 8A",
    description:
      "ধানমন্ডি ৮/এ-তে একটি সুসজ্জিত ফ্ল্যাটে একটি মাস্টার বেডরুম সাবলেট দেওয়া হবে (বাথরুম-সহ)। ওয়াই-ফাই, গ্যাস ও বিদ্যুৎ বিল ভাড়ার মধ্যেই অন্তর্ভুক্ত।",
    images: [
      "https://picsum.photos/seed/dhanmondi-4/700/500",
      "https://picsum.photos/seed/dhanmondi-4b/700/500",
    ],
    rent: "৳৯,০০০",
    rentValue: 9000,
    unit: "/ মাস",
    availableDate: "2026-12-01",
    availableClass: GREEN_TAG,
    tenant: "bachelor",
  },
  {
    id: 5,
    name: "আমানুল্লাহ বিশ্বাস",
    posted: "Posted 1d ago",
    badge: "সাবলেট",
    badgeClass: "bg-purple-50 text-purple-600 border-purple-100",
    road: "Road 9A",
    description:
      "ধানমন্ডি ৯/এ রোডের একটি আবাসিক ভবনে ২ বেডরুমের ফ্ল্যাটে সিঙ্গেল রুম খালি আছে। শান্ত পরিবেশ, ব্যালকনি ও পর্যাপ্ত আলো-বাতাস।",
    images: [
      "https://picsum.photos/seed/dhanmondi-5/700/500",
      "https://picsum.photos/seed/dhanmondi-5b/700/500",
    ],
    rent: "৳৬,২০০",
    rentValue: 6200,
    unit: "/ মাস",
    availableDate: "2026-11-05",
    availableClass: GREEN_TAG,
    tenant: "female",
  },
  {
    id: 6,
    name: "রেজাউল করিম",
    posted: "Posted 2d ago",
    badge: "অফিস স্পেস",
    badgeClass: "bg-amber-50 text-amber-600 border-amber-100",
    road: "Satmasjid Road",
    description:
      "সাতমসজিদ রোডের প্রধান সড়কের পাশে ১২০০ স্কয়ার ফিটের কমার্শিয়াল স্পেস ভাড়া হবে। অফিস, ক্লিনিক বা কোচিং সেন্টারের জন্য উপযোগী, পার্কিং সুবিধা আছে।",
    images: [
      "https://picsum.photos/seed/dhanmondi-6/700/500",
      "https://picsum.photos/seed/dhanmondi-6b/700/500",
    ],
    rent: "৳৫৫,০০০",
    rentValue: 55000,
    unit: "/ মাস",
    availableDate: "2026-12-01",
    availableClass: BLUE_TAG,
    tenant: "any",
  },
];

const sortOptions: { value: SortKey; label: string; short: string }[] = [
  {
    value: "newest",
    label: "নতুন লিস্টিং আগে (Newest first)",
    short: "নতুন লিস্টিং",
  },
  { value: "price-asc", label: "ভাড়া কম থেকে বেশি", short: "ভাড়া কম" },
  { value: "price-desc", label: "ভাড়া বেশি থেকে কম", short: "ভাড়া বেশি" },
  { value: "verified", label: "ভেরিফাইড ফ্ল্যাট আগে", short: "ভেরিফাইড" },
];

/* ------------------------------- Helpers ---------------------------------- */

const bn = (n: number) => n.toLocaleString("bn-BD");
const taka = (n: number) => `৳${bn(n)}`;

const formatShort = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

/** Closes a popover on outside click or Escape. */
const useDismiss = (
  open: boolean,
  close: () => void,
  ref: React.RefObject<HTMLElement | null>,
) => {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, ref]);
};

/* ------------------------------ Filter field ------------------------------- */

type Variant = "default" | "soft"; // "soft" = phone design

const boxClass =
  "relative flex h-9 w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300";

/* Phone: tinted, taller, rounder boxes with no label above */
const softBoxClass =
  "relative flex h-11 w-full items-center gap-1.5 rounded-xl border border-transparent bg-slate-100/80 px-3 text-xs font-semibold text-slate-700 transition";

const labelClass =
  "mb-1 block truncate text-[9px] font-semibold leading-none text-slate-400";

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  icon?: ReactNode;
  className?: string;
  variant?: Variant;
};

/** A compact labelled field. A transparent native <select> sits on top of the
 *  styled box, so it looks custom but works with keyboard and mobile pickers. */
const Field = ({
  label,
  value,
  onChange,
  options,
  icon,
  className = "",
  variant = "default",
}: FieldProps) => {
  const soft = variant === "soft";
  return (
    <div className={`min-w-0 ${className}`}>
      <span className={soft ? "sr-only" : labelClass}>{label}</span>
      <div
        className={`${soft ? softBoxClass : boxClass} focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100`}>
        {icon}
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <select
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

/** A labelled field that opens a popover panel (used for budget + dates). */
const PopField = ({
  label,
  display,
  icon,
  className = "",
  variant = "default",
  align = "left",
  children,
}: {
  label: string;
  display: string;
  icon?: ReactNode;
  className?: string;
  variant?: Variant;
  align?: "left" | "right";
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, wrapRef);
  const soft = variant === "soft";

  return (
    <div ref={wrapRef} className={`relative min-w-0 ${className}`}>
      <span className={soft ? "sr-only" : labelClass}>{label}</span>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`${soft ? softBoxClass : boxClass} text-left ${
          open ? "border-blue-500 ring-2 ring-blue-100" : ""
        }`}>
        {icon}
        <span className="min-w-0 flex-1 truncate">{display}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div
          role="dialog"
          className={`absolute top-full z-40 mt-1.5 w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-300/40 ${
            align === "right" ? "right-0" : "left-0"
          }`}>
          {children}
        </div>
      )}
    </div>
  );
};

/* ------------------------------ Budget range ------------------------------- */

/* Two overlapping native range inputs = one dual-handle slider. */
const thumb =
  "pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
  "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-600 " +
  "[&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-blue-600 " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
  "[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 " +
  "[&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-blue-600";

const BudgetRange = ({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) => {
  const span = BUDGET_MAX - BUDGET_MIN;
  const left = ((min - BUDGET_MIN) / span) * 100;
  const right = ((max - BUDGET_MIN) / span) * 100;

  const setMin = (v: number) =>
    onChange(Math.max(BUDGET_MIN, Math.min(v, max - BUDGET_STEP)), max);
  const setMax = (v: number) =>
    onChange(min, Math.min(BUDGET_MAX, Math.max(v, min + BUDGET_STEP)));

  const numInput =
    "h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div>
      <p className="mb-3 text-center text-xs font-bold text-slate-800">
        {taka(min)} – {taka(max)}
        {max === BUDGET_MAX && "+"}
      </p>

      <div className="relative h-5">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-600"
          style={{ left: `${left}%`, width: `${right - left}%` }}
        />
        <input
          type="range"
          aria-label="Minimum rent"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
          className={thumb}
          style={{ zIndex: min > BUDGET_MAX - 10 * BUDGET_STEP ? 5 : 3 }}
        />
        <input
          type="range"
          aria-label="Maximum rent"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          className={thumb}
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-1 block text-[9px] font-semibold text-slate-400">
            সর্বনিম্ন (৳)
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={BUDGET_MIN}
            max={BUDGET_MAX}
            step={BUDGET_STEP}
            value={min}
            onChange={(e) => setMin(Number(e.target.value) || 0)}
            className={numInput}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[9px] font-semibold text-slate-400">
            সর্বোচ্চ (৳)
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={BUDGET_MIN}
            max={BUDGET_MAX}
            step={BUDGET_STEP}
            value={max}
            onChange={(e) => setMax(Number(e.target.value) || BUDGET_MAX)}
            className={numInput}
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => onChange(BUDGET_MIN, BUDGET_MAX)}
        className="mt-3 text-[11px] font-bold text-blue-600 hover:underline">
        রিসেট
      </button>
    </div>
  );
};

/* ------------------------------ Search section ----------------------------- */

/* Dhanmondi areas / roads come straight from the JSON file.
 * The same list feeds both the search field and the chip row. */
const dhanmondiAreas = locationsData.entries.filter((data) =>
  data.label.includes("Dhanmondi"),
);

const ALL_AREAS = "সব এলাকা (All Areas)";

const areaOptions = [
  ALL_AREAS,
  ...Array.from(new Set(dhanmondiAreas.map((data) => data.name))),
];
const typeOptions = [
  "ফ্যামিলি ফ্ল্যাট",
  "ব্যাচেলর বাসা",
  "মেস / সিট",
  "সাবলেট",
  "অফিস স্পেস",
];

/* "ভাড়াটিয়া" (tenant) — 4 options */
const tenantMap: Record<string, Filters["tenant"]> = {
  "যে কেউ (All)": "all",
  ফ্যামিলি: "family",
  "ব্যাচেলর পুরুষ": "bachelor",
  "মহিলা / ছাত্র": "female",
};
const tenantOptions = Object.keys(tenantMap);

const dateInput =
  "h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const SearchBar = ({
  onSearch,
  variant = "default",
}: {
  onSearch: (f: Filters) => void;
  variant?: Variant;
}) => {
  const soft = variant === "soft";
  const [area, setArea] = useState(areaOptions[0]);
  const [type, setType] = useState(typeOptions[0]);
  const [tenant, setTenant] = useState(tenantOptions[0]);
  const [minRent, setMinRent] = useState(BUDGET_MIN);
  const [maxRent, setMaxRent] = useState(BUDGET_MAX);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const budgetIsAll = minRent === BUDGET_MIN && maxRent === BUDGET_MAX;
  const budgetDisplay = budgetIsAll
    ? soft
      ? "বাজেট"
      : "যে কোনো বাজেট"
    : `${taka(minRent)} - ${taka(maxRent)}${maxRent === BUDGET_MAX ? "+" : ""}`;

  const dateDisplay =
    fromDate && toDate
      ? `${formatShort(fromDate)} - ${formatShort(toDate)}`
      : fromDate
        ? `${formatShort(fromDate)} থেকে`
        : toDate
          ? `${formatShort(toDate)} পর্যন্ত`
          : soft
            ? "কবে থেকে"
            : "তারিখ বেছে নিন";

  const submit = () =>
    onSearch({
      tenant: tenantMap[tenant],
      minRent,
      maxRent,
      fromDate,
      toDate,
    });

  const budgetField = (
    <PopField
      label="বাজেট (মাসিক)"
      display={budgetDisplay}
      variant={variant}
      icon={<Wallet className="h-3.5 w-3.5 shrink-0 text-blue-600" />}>
      <BudgetRange
        min={minRent}
        max={maxRent}
        onChange={(a, b) => {
          setMinRent(a);
          setMaxRent(b);
        }}
      />
    </PopField>
  );

  const dateField = (
    <PopField
      label="ভাড়ার সময় (তারিখ)"
      display={dateDisplay}
      variant={variant}
      align={soft ? "right" : "left"}
      icon={<CalendarDays className="h-3.5 w-3.5 shrink-0 text-blue-600" />}>
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-[9px] font-semibold text-slate-400">
            শুরুর তারিখ
          </span>
          <input
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => setFromDate(e.target.value)}
            className={dateInput}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[9px] font-semibold text-slate-400">
            শেষ তারিখ
          </span>
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => setToDate(e.target.value)}
            className={dateInput}
          />
        </label>
        {(fromDate || toDate) && (
          <button
            type="button"
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline">
            <X className="h-3 w-3" />
            তারিখ মুছুন
          </button>
        )}
      </div>
    </PopField>
  );

  /* ------------------------------ Phone layout ----------------------------- */
  if (soft) {
    return (
      <div className="w-full rounded-[22px] bg-white p-3 shadow-xl shadow-blue-950/30">
        {/* Location row */}
        <div className="relative flex h-14 items-center gap-3 rounded-xl bg-slate-100/80 px-3 focus-within:ring-2 focus-within:ring-blue-200">
          <MapPin className="h-5 w-5 shrink-0 fill-blue-600 text-white" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[10px] text-slate-400">
              ঢাকা › ধানমন্ডি ›{" "}
              <span className="font-bold text-blue-600">এলাকা</span>
            </p>
            <p className="mt-0.5 truncate text-[13px] font-bold text-slate-900">
              {area}
            </p>
          </div>
          {area !== ALL_AREAS ? (
            <button
              type="button"
              aria-label="এলাকা মুছুন"
              onClick={() => setArea(ALL_AREAS)}
              className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 active:bg-slate-200">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          )}
          <select
            aria-label="এলাকা বা রোড বেছে নিন"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
            {areaOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        {/* 2 x 2 grid */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Field
            variant="soft"
            label="বাসার ধরন"
            value={type}
            onChange={setType}
            options={typeOptions}
          />
          <Field
            variant="soft"
            label="ভাড়াটিয়া"
            value={tenant}
            onChange={setTenant}
            options={tenantOptions}
          />
          {budgetField}
          {dateField}
        </div>

        <button
          type="button"
          onClick={submit}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-[13px] font-bold text-white shadow-lg shadow-blue-600/30 active:bg-blue-700">
          <Search className="h-4 w-4" />
          Search Rooms / বাসা খুঁজুন
        </button>
      </div>
    );
  }

  /* ---------------------------- Desktop layout ----------------------------- */
  return (
    <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-100 bg-white p-3 shadow-lg shadow-slate-200/70">
      <div className="grid grid-cols-2 gap-x-2 gap-y-3 md:grid-cols-[1.75fr_1.1fr_0.95fr_1.25fr_1.2fr_auto] md:items-end">
        <Field
          className="col-span-2 md:col-span-1"
          label="এলাকা বা রোড বেছে নিন"
          value={area}
          onChange={setArea}
          options={areaOptions}
          icon={
            <MapPin className="h-3.5 w-3.5 shrink-0 fill-blue-600 text-white" />
          }
        />
        <Field
          label="বাসার ধরন"
          value={type}
          onChange={setType}
          options={typeOptions}
        />
        <Field
          label="ভাড়াটিয়া"
          value={tenant}
          onChange={setTenant}
          options={tenantOptions}
        />
        {budgetField}
        {dateField}

        <button
          type="button"
          onClick={submit}
          className="col-span-2 flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-blue-600 px-4 text-[11px] font-bold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 md:col-span-1">
          <Search className="h-3.5 w-3.5" />
          বাসা খুঁজুন
        </button>
      </div>
    </div>
  );
};

/* ------------------------------ Sort dropdown ------------------------------ */

const SortDropdown = ({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, wrapRef);
  const current = sortOptions.find((o) => o.value === value) ?? sortOptions[0];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200">
        <span className="whitespace-nowrap">{current.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-1.5 w-60 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-xl shadow-slate-300/40">
          {sortOptions.map((opt) => {
            const selected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[11px] font-semibold transition ${
                    selected
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}>
                  {opt.label}
                  {selected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

/* ---------------------------- Scrollable chip row --------------------------- */
/* Works everywhere: touch swipe on phones, and on laptop / desktop / tablet
 * with arrow buttons, click-and-drag, and touchpad / shift+wheel scrolling. */

const ChipScroller = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });
  const [dragging, setDragging] = useState(false);
  const [edges, setEdges] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [update, children]);

  const scrollByDir = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  /* Click-and-drag (mouse only; touch already scrolls natively) */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startLeft: ref.current.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active || !ref.current) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 5) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) ref.current.scrollLeft = d.startLeft - dx;
  };

  const endDrag = () => {
    drag.current.active = false;
    setDragging(false);
  };

  /* A drag must not count as a chip click */
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const arrowBtn =
    "absolute top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:border-blue-300 hover:text-blue-600 md:flex";

  return (
    <div className="relative">
      {edges.left && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] hidden w-14 bg-gradient-to-r from-slate-50 to-transparent md:block" />
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByDir(-1)}
            className={`${arrowBtn} left-0`}>
            <ChevronLeft className="h-4 w-4" />
          </button>
        </>
      )}

      <div
        ref={ref}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className={`flex select-none gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-1 ${
          dragging ? "cursor-grabbing" : "md:cursor-grab"
        }`}>
        {children}
      </div>

      {edges.right && (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] hidden w-14 bg-gradient-to-l from-slate-50 to-transparent md:block" />
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByDir(1)}
            className={`${arrowBtn} right-0`}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
};

/* ------------------------------ Phone banner ------------------------------- */
/* Dark-blue intro card under the search box. The top-right pill is the sort
 * control (native select on top), the bottom strip shows the result count. */

const MobileBanner = ({
  count,
  sort,
  onSort,
}: {
  count: number;
  sort: SortKey;
  onSort: (v: SortKey) => void;
}) => {
  const current = sortOptions.find((o) => o.value === sort) ?? sortOptions[0];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#14307f] to-[#1d44b8] p-4 text-white shadow-lg shadow-blue-900/25">
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-36 w-36 rounded-full border-[12px] border-white/5" />

      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <Compass className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            ধানমন্ডির সর্বশেষ লিস্টিং
          </p>
          <h2 className="mt-1 text-[15px] font-extrabold leading-snug">
            ধানমন্ডি এলাকায় খুঁজুন আপনার পছন্দের বাসা ও রুম
          </h2>
        </div>

        {/* Sort pill */}
        <div className="relative shrink-0">
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1.5 text-[10px] font-bold">
            {current.short}
            <ChevronDown className="h-3 w-3" />
          </span>
          <select
            aria-label="সর্ট করুন"
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative mt-3 flex items-center justify-between gap-2 rounded-xl bg-white/10 px-3 py-2.5">
        <span className="flex min-w-0 items-center gap-2 text-[11px] text-blue-100">
          <BadgeCheck className="h-4 w-4 shrink-0" />
          <span className="truncate">ধানমন্ডি এলাকার সঠিক ভাড়া ও যাচাইকৃত বাসা</span>
        </span>
        <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold">
          {bn(count)}টি বাসা
        </span>
      </div>
    </div>
  );
};

/* ---------------------------------- Page ---------------------------------- */

const DEFAULT_FILTERS: Filters = {
  tenant: "all",
  minRent: BUDGET_MIN,
  maxRent: BUDGET_MAX,
  fromDate: "",
  toDate: "",
};

const Home = () => {
  const [activeChip, setActiveChip] = useState(0);
  const [visible, setVisible] = useState(6);
  const [sort, setSort] = useState<SortKey>("newest");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filteredListings = useMemo(
    () =>
      listings.filter((l) => {
        if (
          filters.tenant !== "all" &&
          l.tenant !== "any" &&
          l.tenant !== filters.tenant
        )
          return false;
        if (l.rentValue < filters.minRent) return false;
        // Upper bound is open-ended when the slider is at its maximum
        if (filters.maxRent < BUDGET_MAX && l.rentValue > filters.maxRent)
          return false;
        if (filters.fromDate && l.availableDate < filters.fromDate)
          return false;
        if (filters.toDate && l.availableDate > filters.toDate) return false;
        return true;
      }),
    [filters],
  );

  const sortedListings = useMemo(() => {
    const list = [...filteredListings]; // never mutate the original order
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.rentValue - b.rentValue);
      case "price-desc":
        return list.sort((a, b) => b.rentValue - a.rentValue);
      case "verified":
        // Array.sort is stable, so each group keeps its newest-first order
        return list.sort((a, b) => Number(!!b.verified) - Number(!!a.verified));
      default:
        return list;
    }
  }, [sort, filteredListings]);

  const resetAll = () => {
    setSort("newest");
    setActiveChip(0);
    setVisible(6);
    setFilters(DEFAULT_FILTERS);
  };

  const handleSearch = (f: Filters) => {
    setFilters(f);
    setVisible(6);
  };

  const shown = sortedListings.slice(0, visible);
  const hasMore = visible < sortedListings.length;

  return (
    <main className="min-h-screen bg-slate-50/60">
      {/* ===================== DESKTOP / TABLET (md and up) ===================== */}
      <div className="hidden md:block">
        {/* Hero + search */}
        <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50 px-4 pb-8 pt-8 sm:px-6 sm:pt-10 lg:px-10">
          <h1 className="mb-5 text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            ধানমন্ডিতে <span className="text-blue-600">বাসা, মেস ও সাবলেট</span>{" "}
            খুঁজুন
          </h1>
          <SearchBar onSearch={handleSearch} />
        </section>

        {/* Listings */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          {/* Heading row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900 sm:text-lg">
              <span className="h-5 w-1 rounded-full bg-blue-600" />
              ধানমন্ডি এলাকার টু-লেট লিস্টিং
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400">
                সর্ট করুন:
              </span>
              <SortDropdown value={sort} onChange={setSort} />
              <button
                type="button"
                aria-label="Refresh"
                onClick={resetAll}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:text-blue-600">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Area chips */}
          <div className="mt-4 border-b border-slate-100 pb-3">
            <ChipScroller>
              {dhanmondiAreas.map((chip, i) => (
                <button
                  key={chip.name}
                  type="button"
                  onClick={() => setActiveChip(i)}
                  className={`flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${
                    activeChip === i
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                  }`}>
                  {i === 0 && (
                    <MapPin className="h-3 w-3 fill-white text-blue-600" />
                  )}
                  {chip.name}
                </button>
              ))}
            </ChipScroller>
          </div>

          {/* Grid */}
          {sortedListings.length === 0 ? (
            <p className="mt-10 text-center text-sm font-semibold text-slate-400">
              এই ফিল্টারে কোনো বাসা পাওয়া যায়নি।
            </p>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {shown.map((item, i) => (
                <ListingCard key={item.id} item={item} active={i === 0} />
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + 6)}
                className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-2.5 text-xs font-bold text-blue-700 shadow-sm transition hover:bg-blue-100">
                <ChevronDown className="h-4 w-4" />
                আরও বাসা ও রুম দেখুন (Load More Rooms)
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ========================== PHONE (below md) =========================== */}
      <div className="min-h-screen bg-[#eef3fb] md:hidden">
        {/* Blue hero with the search card */}
        <section className="bg-gradient-to-b from-[#0a1f6b] via-[#12308f] to-[#1d4ed8] px-4 pb-7 pt-5">
          <SearchBar onSearch={handleSearch} variant="soft" />
        </section>

        <section className="px-4 pb-10 pt-4">
          <MobileBanner
            count={sortedListings.length}
            sort={sort}
            onSort={setSort}
          />

          {sortedListings.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="text-sm font-semibold text-slate-400">
                এই ফিল্টারে কোনো বাসা পাওয়া যায়নি।
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-3 text-xs font-bold text-blue-600">
                ফিল্টার রিসেট করুন
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {shown.map((item) => (
                <ListingCard key={item.id} item={item} variant="mobile" />
              ))}
            </div>
          )}

          {hasMore && (
            <button
              type="button"
              onClick={() => setVisible((v) => v + 6)}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white text-[13px] font-bold text-blue-700 shadow-sm active:bg-blue-50">
              <ChevronDown className="h-4 w-4" />
              আরও লিস্টিং দেখুন (Show More Listings)
            </button>
          )}
        </section>
      </div>
    </main>
  );
};

export default Home;