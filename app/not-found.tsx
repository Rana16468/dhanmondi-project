"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Compass, Home, Megaphone, SearchX, User } from "lucide-react";

const quickLinks = [
  { href: "/", icon: Compass, title: "বাসা খুঁজুন", text: "ধানমন্ডির সব চলমান বিজ্ঞাপন দেখুন" },
  { href: "/post-ad", icon: Megaphone, title: "বিজ্ঞাপন দিন", text: "আপনার বাসা ফ্রিতে লিস্ট করুন" },
  { href: "/profile", icon: User, title: "আমার অ্যাকাউন্ট", text: "আপনার লিস্টিং ও প্রোফাইল" },
];

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-900">
      {/* soft background shapes */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-100/70" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-indigo-100/70" />

      {/* brand */}
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-700 text-white">
            <Home size={19} />
          </span>
          <span className="text-[15px] font-bold tracking-tight">ধানমন্ডি রেন্টাল</span>
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 pb-10 text-center sm:px-6">
        {/* 4 [icon] 4 */}
        <div className="flex items-center justify-center gap-2 sm:gap-3" aria-hidden="true">
          <span className="text-7xl font-extrabold leading-none text-blue-700 sm:text-8xl">4</span>
          <span className="grid h-16 w-16 place-items-center rounded-full bg-blue-700 text-white shadow-lg shadow-blue-700/30 sm:h-20 sm:w-20">
            <SearchX className="h-8 w-8 sm:h-10 sm:w-10" />
          </span>
          <span className="text-7xl font-extrabold leading-none text-blue-700 sm:text-8xl">4</span>
        </div>

        <h1 className="mt-6 text-xl font-bold sm:text-2xl">পেজটি খুঁজে পাওয়া যায়নি</h1>
        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-slate-500 sm:text-sm">
          আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরিয়ে ফেলা হয়েছে, মুছে গেছে অথবা লিংকটি ভুল।
          নিচের অপশন থেকে আপনার পছন্দের জায়গায় চলে যান।
        </p>

        {/* main actions */}
        <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-[13px] font-semibold text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-800"
          >
            <Home size={16} /> হোম পেজে ফিরুন
          </Link>
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} /> আগের পেজে যান
          </button>
        </div>

        {/* quick links */}
        <div className="mt-10 w-full">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">দ্রুত যান</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickLinks.map(({ href, icon: Icon, title, text }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md sm:flex-col sm:items-start sm:gap-2"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-[13px] font-bold text-slate-900">{title}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{text}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default NotFound;