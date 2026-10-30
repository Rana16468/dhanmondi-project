"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  type CredentialResponse,
} from "@react-oauth/google";
import Bowser from "bowser";
import { Camera, Home, MapPin, Search, ShieldCheck, TriangleAlert } from "lucide-react";

/* ---------- types ---------- */

type GoogleAuthProfile = {
  name: string;
  email: string;
  os: string;
  photo?: string;
  browser: string;
  device: string;
  ipAddress: string;
  isVerify: boolean;
};

type GoogleClaims = {
  name?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
};

/* ---------- build the profile object from the Google credential ---------- */

async function createGoogleAuthProfile(credential: string): Promise<GoogleAuthProfile> {
  const encodedPayload = credential.split(".")[1];
  if (!encodedPayload) throw new Error("Google returned an invalid credential.");

  const normalized = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  const claims = JSON.parse(new TextDecoder().decode(bytes)) as GoogleClaims;

  const deviceInfo = Bowser.getParser(navigator.userAgent).getResult();
  const ipInfoUrl = process.env.NEXT_PUBLIC_IP_INFO_URL ?? "https://api.ipify.org?format=json";

  let ipAddress = "N/A";
  try {
    const res = await fetch(ipInfoUrl);
    if (!res.ok) throw new Error(`IP lookup returned ${res.status}.`);
    const data = (await res.json()) as { ip?: string };
    ipAddress = data.ip || "N/A";
  } catch {
    ipAddress = "N/A";
  }

  return {
    name: claims.name || "Unknown",
    email: claims.email || "Unknown",
    photo: claims.picture,
    os: `${deviceInfo.os.name || "Unknown"} ${deviceInfo.os.version || ""}`.trim(),
    browser: deviceInfo.browser.name || "Unknown",
    device: deviceInfo.platform.type
      ? deviceInfo.platform.type.charAt(0).toUpperCase() + deviceInfo.platform.type.slice(1)
      : "Desktop",
    ipAddress,
    isVerify: claims.email_verified ?? false,
  };
}

/* ---------- small UI pieces ---------- */

const features = [
  { icon: Camera, title: "ছবিসহ বাসা লিস্টিং", text: "বাসার ছবি, ভাড়া ও ঠিকানা দিয়ে মিনিটেই বিজ্ঞাপন পোস্ট করুন।" },
  { icon: Search, title: "ফিল্টার করে খুঁজুন", text: "ভাড়া, তারিখ ও ভাড়াটিয়ার ধরন অনুযায়ী পছন্দের বাসা বেছে নিন।" },
  { icon: ShieldCheck, title: "যাচাইকৃত অ্যাকাউন্ট", text: "Google দিয়ে ভেরিফাই করা ব্যবহারকারীদের সাথেই যোগাযোগ করুন।" },
];



const page = () => {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  const boxRef = useRef<HTMLDivElement>(null);
  const [btnWidth, setBtnWidth] = useState(280);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const w = boxRef.current?.offsetWidth;
    if (w) setBtnWidth(Math.max(200, Math.min(360, w)));
  }, []);

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setError("Google সাইন-ইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const data = await createGoogleAuthProfile(response.credential);
      console.log("✅ Google auth profile:", data);
      
      router.push("/profile"); 
    } catch (e) {
      console.error("Google sign-in error:", e);
      setError("সাইন-ইন করা যায়নি। আবার চেষ্টা করুন।");
      setBusy(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="grid min-h-screen bg-slate-100 lg:grid-cols-2">
        {/* ===== Brand panel (desktop) ===== */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" />

          <div className="relative flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded bg-white text-blue-700">
              <Home size={22} />
            </span>
            <span className="text-lg font-bold tracking-tight">ধানমন্ডি রেন্টাল</span>
          </div>

          <div className="relative max-w-md">
            <span className="inline-flex items-center gap-1.5 rounded bg-white/15 px-2.5 py-1 text-[12px] font-semibold">
              <MapPin size={13} /> শুধু ধানমন্ডির জন্য
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-snug xl:text-4xl">
              ধানমন্ডিতে পছন্দের বাসা খুঁজুন, অথবা আপনার বাসা ভাড়া দিন
            </h1>
            <ul className="mt-8 space-y-5">
              {features.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-white/15">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-[14px] font-bold">{title}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-blue-100">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-[12px] text-blue-200">© ধানমন্ডি রেন্টাল ম্যানেজমেন্ট সিস্টেম</p>
        </aside>

        {/* ===== Auth card ===== */}
        <main className="flex items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            {/* mobile brand */}
            <div className="mb-6 flex items-center justify-center gap-2.5 lg:hidden">
              <span className="grid h-9 w-9 place-items-center rounded bg-blue-600 text-white">
                <Home size={20} />
              </span>
              <span className="text-base font-bold text-slate-900">ধানমন্ডি রেন্টাল</span>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">স্বাগতম!</h2>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                    বাসা খুঁজতে বা ভাড়া দিতে আপনার Google অ্যাকাউন্ট দিয়ে চালিয়ে যান।
                    আলাদা কোনো ফর্ম পূরণ করতে হবে না।
                  </p>

                  {!clientId && (
                    <div className="mt-5 flex items-start gap-2 rounded border border-amber-300 bg-amber-50 p-3 text-left text-[12px] text-amber-800">
                      <TriangleAlert size={15} className="mt-0.5 shrink-0" />
                      <span>
                        <code className="font-semibold">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> সেট করা নেই। `.env.local`
                        ফাইলে এটি যোগ করে সার্ভার রিস্টার্ট দিন।
                      </span>
                    </div>
                  )}

                  <div
                    ref={boxRef}
                    className={`mt-6 flex justify-center ${busy ? "pointer-events-none opacity-50" : ""}`}
                  >
                    <GoogleLogin
                      onSuccess={handleSuccess}
                      onError={() => setError("Google সাইন-ইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।")}
                      theme="outline"
                      size="large"
                      shape="rectangular"
                      text="continue_with"
                      width={String(btnWidth)}
                    />
                  </div>

                  {busy && <p className="mt-3 text-[12px] text-slate-500">আপনার তথ্য যাচাই করা হচ্ছে, প্রোফাইলে নিয়ে যাওয়া হচ্ছে...</p>}

                  {error && (
                    <p role="alert" className="mt-3 flex items-center justify-center gap-1 text-[12px] font-medium text-red-600">
                      <TriangleAlert size={13} /> {error}
                    </p>
                  )}

                  <p className="mt-6 border-t border-slate-100 pt-4 text-[11px] leading-relaxed text-slate-500">
                    চালিয়ে যাওয়ার মাধ্যমে আপনি আমাদের <span className="underline">শর্তাবলী</span> ও{" "}
                    <span className="underline">গোপনীয়তা নীতি</span>তে সম্মত হচ্ছেন।
                  </p>
                </div>
            </div>
          </div>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
};

export default page;