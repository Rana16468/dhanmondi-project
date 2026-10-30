"use client";

import Link from "next/link";
import {
  Home,
  Link2,
  MapPin,
  ShieldCheck,
  Headphones,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

type IconProps = { className?: string };

const FacebookIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3z" />
  </svg>
);

const LinkedinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6.9 8.9H3.6V20h3.3V8.9zM5.3 3.5a1.9 1.9 0 100 3.8 1.9 1.9 0 000-3.8zM20.4 13.6c0-3-1.6-4.9-4.2-4.9-1.4 0-2.4.7-2.9 1.5V8.9h-3.2V20h3.3v-6c0-1.6.6-2.6 1.9-2.6 1.2 0 1.8.9 1.8 2.6V20h3.3v-6.4z" />
  </svg>
);

const quickLinks = [
  { label: "হোম পেজ", href: "/" },
  { label: "বাসা খুঁজুন", href: "/rooms" },
  { label: "বিজ্ঞাপন দিন (ফ্রি)", href: "/post-ad", highlight: true },
  { label: "ভাড়াটিয়া নির্দেশিকা", href: "/tenant-guide" },
  { label: "সেফটি টিপস", href: "/safety-tips" },
];

const areas = [
  { label: "ধানমন্ডি ২৭ নম্বর", href: "/area/dhanmondi-27" },
  { label: "ধানমন্ডি ৯/এ", href: "/area/dhanmondi-9a" },
  { label: "ধানমন্ডি ৬৫ রোড", href: "/area/dhanmondi-65" },
  { label: "ধানমন্ডি ৮/এ", href: "/area/dhanmondi-8a" },
  { label: "শংকর ও পশ্চিম ধানমন্ডি", href: "/area/shankar" },
];

const legal = [
  { label: "ব্যবহারের শর্তাবলী", href: "/terms" },
  { label: "গোপনীয়তা নীতি", href: "/privacy" },
  { label: "রিফান্ড ও বাতিল নীতি", href: "/refund" },
  { label: "প্রতারণা প্রতিরোধ নীতি", href: "/fraud-prevention" },
  { label: "কমিউনিটি গাইডলাইন", href: "/community-guidelines" },
];

const socials = [
  { Icon: FacebookIcon, href: "#", label: "Facebook" },
  { Icon: MessageCircle, href: "#", label: "WhatsApp" },
  { Icon: LinkedinIcon, href: "#", label: "LinkedIn" },
];

const linkClass = "text-[15px] text-slate-500 transition hover:text-blue-600";
const headingClass =
  "mb-4 flex items-center gap-2 text-[15px] font-bold text-slate-900";

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-12 lg:pt-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.1fr] lg:gap-x-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 lg:pr-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30">
                <Home className="h-5 w-5 fill-white text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                Dhanmondi <span className="text-blue-600">Rooms</span>
              </span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-slate-500">
              Need a room, flat, sublet or roommate in Dhanmondi, Dhaka? Browse
              100% verified listings, call the host directly, or post your own
              room with zero brokerage.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className={headingClass}>
              <Link2 className="h-4 w-4 text-blue-600" />
              জরুরি লিঙ্ক
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={
                      item.highlight
                        ? "text-[15px] font-semibold text-blue-600 hover:text-blue-700"
                        : linkClass
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular areas */}
          <div>
            <h4 className={headingClass}>
              <MapPin className="h-4 w-4 fill-blue-600 text-blue-600" />
              জনপ্রিয় এলাকা
            </h4>
            <ul className="space-y-3">
              {areas.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/areas"
                  className="inline-flex items-center gap-1 text-[15px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  সকল রোড দেখুন <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={headingClass}>
              <ShieldCheck className="h-4 w-4 fill-blue-600 text-blue-600" />
              আইনি ও শর্তাবলী
            </h4>
            <ul className="space-y-3">
              {legal.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className={headingClass}>
              <Headphones className="h-4 w-4 text-blue-600" />
              যোগাযোগ ও সাপোর্ট
            </h4>
            <ul className="space-y-3 text-[15px] text-slate-500">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 fill-slate-400 text-slate-400" />
                হেল্পলাইন: ০৯৬৬২-XXXXXX
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 fill-slate-400 text-white" />
                <span className="break-all">support@dhanmondirooms.bd</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 fill-slate-400 text-slate-400" />
                ধানমন্ডি, ঢাকা-১২০৫, বাংলাদেশ
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-blue-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-2 border-t border-slate-100 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:mt-16">
          <p>© ২০২৬ Dhanmondi Rooms. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-xs font-semibold">BD</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;