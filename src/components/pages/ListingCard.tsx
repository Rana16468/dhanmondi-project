"use client";

import Link from "next/link";
import { MapPin, Camera, Eye, BadgeCheck, ChevronRight } from "lucide-react";

/* Works with your existing `Listing` objects (extra fields are simply ignored). */
export type ListingCardItem = {
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
  unit: string;
  availableDate: string; // ISO "YYYY-MM-DD"
  availableClass: string;
};

const DETAILS_URL = "/details_page";

/** "2026-12-01" -> "১ ডিসেম্বর ২০২৬" (UTC so server & client always match) */
const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

const bnNum = (n: number) => n.toLocaleString("bn-BD");

type CardProps = { item: ListingCardItem; active?: boolean };

/* ------------------------------ Desktop card ------------------------------- */
/* (unchanged from your current design) */

const DesktopCard = ({ item, active }: CardProps) => {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-md shadow-slate-200/60 transition-shadow hover:shadow-xl hover:shadow-slate-300/50 ${
        active ? "border-blue-300 ring-1 ring-blue-200" : "border-slate-100"
      }`}>
      {/* Top: owner, location, description */}
      <div className="flex flex-col gap-3 p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {item.name.charAt(0)}
            </div>
            <div className="min-w-0 leading-tight">
              <h3 className="flex items-center gap-1 text-[15px] font-bold text-slate-900">
                <span className="truncate">{item.name}</span>
                {item.verified && (
                  <BadgeCheck className="h-4 w-4 shrink-0 fill-blue-600 text-white" />
                )}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                {item.posted}
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-md border px-2.5 py-1 text-[11px] font-bold ${item.badgeClass}`}>
            {item.badge}
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-4 w-4 shrink-0 fill-blue-600 text-white" />
          <span className="truncate">
            Dhaka › Dhanmondi ›{" "}
            <span className="font-bold text-slate-800">{item.road}</span>
          </span>
        </p>

        <div>
          <p className="line-clamp-3 text-[13px] leading-6 text-slate-500">
            {item.description}
          </p>
          <Link
            href={DETAILS_URL}
            className="mt-1 inline-block text-[13px] font-bold text-blue-600 hover:underline">
            আরও দেখুন
          </Link>
        </div>
      </div>

      {/* Photo: edge to edge */}
      <Link
        href={DETAILS_URL}
        aria-label={`${item.name} — ছবি দেখুন`}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.images[0]}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-slate-900/80 px-2 py-1 text-[11px] font-semibold text-white">
          <Camera className="h-3.5 w-3.5" />
          {item.images.length}
        </span>
      </Link>

      {/* Bottom: price, availability, button */}
      <div className="mt-auto flex flex-col gap-4 p-5 pt-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Rent
            </p>
            <p className="text-xl font-extrabold leading-tight text-slate-900">
              {item.rent}{" "}
              <span className="text-xs font-medium text-slate-400">
                {item.unit}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Available from
            </p>
            <span
              className={`mt-1 inline-block rounded-md border px-2.5 py-1 text-[11px] font-bold ${item.availableClass}`}>
              {formatDate(item.availableDate)}
            </span>
          </div>
        </div>

        <Link
          href={DETAILS_URL}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-[13px] font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700">
          <Eye className="h-4 w-4" />
          বিস্তারিত দেখুন ও যোগাযোগ
        </Link>
      </div>
    </article>
  );
};

/* ------------------------------- Mobile card ------------------------------- */
/* Phone design: rounded white card, pill badge, inset rounded photo with
 * "1/8" counter + round arrow, rent / available row, divider, full-width CTA. */

const MobileCard = ({ item }: CardProps) => {
  return (
    <article className="rounded-[22px] bg-white p-4 shadow-[0_6px_24px_-8px_rgba(30,64,175,0.18)] ring-1 ring-slate-100">
      {/* Owner row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0f1f55] text-base font-bold text-white">
            {item.name.charAt(0)}
          </div>
          <div className="min-w-0 leading-tight">
            <h3 className="flex items-center gap-1 text-[15px] font-extrabold text-slate-900">
              <span className="truncate">{item.name}</span>
              {item.verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 fill-blue-600 text-white" />
              )}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="h-2 w-2 rounded-full border border-slate-300" />
              {item.posted}
            </p>
          </div>
        </div>
        <span
          className={`max-w-[34%] shrink-0 rounded-full border px-3 py-1.5 text-center text-[10px] font-bold leading-tight ${item.badgeClass}`}>
          {item.badge}
        </span>
      </div>

      {/* Location */}
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span className="truncate">
          Dhaka › Dhanmondi ›{" "}
          <span className="font-bold text-slate-800">{item.road}</span>
        </span>
      </p>

      {/* Description + Read more */}
      <p className="mt-2.5 line-clamp-3 text-[12.5px] leading-[1.35rem] text-slate-500">
        {item.description}
      </p>
      <Link
        href={DETAILS_URL}
        className="mt-0.5 inline-block text-[12.5px] font-bold text-blue-600">
        Read more
      </Link>

      {/* Photo (inset, rounded) */}
      <Link
        href={DETAILS_URL}
        aria-label={`${item.name} — ছবি দেখুন`}
        className="relative mt-3 block aspect-[3/2] w-full overflow-hidden rounded-2xl bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.images[0]}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-slate-900/75 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          <Camera className="h-3.5 w-3.5" />1/{item.images.length}
        </span>
        <span className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md">
          <ChevronRight className="h-4 w-4" />
        </span>
      </Link>

      {/* Rent + availability */}
      <div className="mt-3.5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Rent
          </p>
          <p className="mt-0.5 text-[22px] font-extrabold leading-none text-[#0f1f55]">
            {item.rent}{" "}
            <span className="text-[11px] font-medium text-slate-400">
              {item.unit}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Available from
          </p>
          <span
            className={`mt-1 inline-block rounded-lg border px-2.5 py-1 text-[11px] font-bold ${item.availableClass}`}>
            {formatDate(item.availableDate)}
          </span>
        </div>
      </div>

      {/* Divider + CTA */}
      <div className="mt-3.5 border-t border-slate-100 pt-3.5">
        <Link
          href={DETAILS_URL}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-[13px] font-bold text-white shadow-md shadow-blue-600/25 active:bg-blue-700">
          <Eye className="h-4 w-4" />
          বিস্তারিত দেখুন ও যোগাযোগ
        </Link>
      </div>
    </article>
  );
};

/* --------------------------------- Export ---------------------------------- */

const ListingCard = ({
  item,
  active,
  variant = "desktop",
}: CardProps & { variant?: "desktop" | "mobile" }) =>
  variant === "mobile" ? (
    <MobileCard item={item} active={active} />
  ) : (
    <DesktopCard item={item} active={active} />
  );

export default ListingCard;
export { bnNum };