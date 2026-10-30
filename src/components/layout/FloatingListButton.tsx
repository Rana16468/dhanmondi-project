"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus } from "lucide-react";

/* Pages that show a fixed contact bar (WhatsApp / Call) at the bottom on
 * mobile and tablet. On these pages the button sits just above that bar,
 * so the two never overlap. Add any other route that has a bottom bar. */
const PAGES_WITH_BOTTOM_BAR = ["/details_page"];

const FloatingListButton = () => {
  const pathname = usePathname();

  // যদি বর্তমান রাউটটি "/post-ad" হয়, তবে বাটনটি রেন্ডার হবে না (ডিসপ্লে হবে না)
  if (pathname === "/post-ad") {
    return null;
  }
  if (pathname === "/profile") return null;

  const hasBottomBar = PAGES_WITH_BOTTOM_BAR.some((route) =>
    pathname?.startsWith(route),
  );

  return (
    <>
      {/* Gentle up-and-down bobbing, paused on hover, off for reduced-motion */}
      <style>{`
        @keyframes floating-list-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .floating-list-btn {
          animation: floating-list-bob 2.2s ease-in-out infinite;
        }
        .floating-list-btn:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .floating-list-btn { animation: none; }
        }
      `}</style>

      <Link
        href="/post-ad"
        className={`floating-list-btn fixed right-4 z-50 sm:right-5 ${
          hasBottomBar ? "bottom-[88px] lg:bottom-5" : "bottom-4 sm:bottom-5"
        }`}>
        {/* "ফ্রি" badge on the top-right corner */}
        <span className="absolute -right-1 -top-2 z-10 rounded-full border-2 border-white bg-rose-500 px-2 py-px text-[9px] font-extrabold leading-tight text-white shadow-md sm:text-[10px]">
          ফ্রি
        </span>

        {/* Blue pill */}
        <span className="flex items-center gap-2.5 rounded-full border-[3px] border-white bg-blue-600 py-1.5 pl-3 pr-4 text-white shadow-xl shadow-blue-600/40 transition-colors hover:bg-blue-700 sm:gap-3 sm:py-2 sm:pl-3.5 sm:pr-5">
          {/* House icon with a small plus badge */}
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center sm:h-8 sm:w-8">
            <Home
              className="h-6 w-6 text-white sm:h-7 sm:w-7"
              strokeWidth={1.6}
            />
            <span className="absolute -bottom-0.5 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-[1.5px] border-white bg-blue-600 sm:h-4 sm:w-4">
              <Plus className="h-2 w-2 text-white" strokeWidth={3} />
            </span>
          </span>

          {/* Two-line text */}
          <span className="flex flex-col leading-tight">
            <span className="text-[10px] font-medium text-blue-100 sm:text-[11px]">
              বাড়ি ভাড়া দিতে চান?
            </span>
            <span className="text-[13px] font-extrabold sm:text-sm">
              আপনার বাসা লিস্ট করুন
            </span>
          </span>
        </span>
      </Link>
    </>
  );
};

export default FloatingListButton;
