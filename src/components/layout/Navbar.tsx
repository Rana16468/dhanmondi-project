"use client";

import Link from "next/link";
import { Home, UserCircle2, Plus } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/30 sm:h-10 sm:w-10 sm:rounded-xl">
            <Home className="h-4 w-4 fill-white text-white sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-base font-extrabold tracking-tight text-slate-900 sm:text-xl">
              Dhanmondi <span className="text-blue-600">Rooms</span>
            </h1>
            <p className="hidden truncate text-[9px] font-semibold uppercase tracking-wider text-slate-400 sm:block">
              Find your room, in Dhanmondi
            </p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* My Account */}
          <div className="rounded-full border border-slate-100 bg-white p-0.5 shadow-sm shadow-slate-200/70">
            <Link
              href="/account"
              className="flex h-8 items-center gap-1.5 rounded-full bg-blue-600 px-3 text-white transition hover:bg-blue-700 sm:h-9 sm:gap-2 sm:px-4"
            >
              <UserCircle2 className="h-4 w-4 shrink-0" />
              <span className="hidden flex-col text-left leading-none sm:flex">
                <span className="text-[8px] font-bold uppercase tracking-wide text-blue-100">
                  My Account
                </span>
                <span className="mt-0.5 text-xs font-bold">অ্যাকাউন্ট / লগইন</span>
              </span>
              <span className="text-xs font-bold sm:hidden">লগইন</span>
            </Link>
          </div>

          {/* Post Ad */}
          <Link
            href="/post-ad"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-white transition hover:bg-slate-800 sm:gap-2 sm:px-4"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-bold">বিজ্ঞাপন দিন</span>
            <span className="hidden rounded bg-emerald-900/60 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-400 sm:inline">
              FREE
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;