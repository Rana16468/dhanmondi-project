"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  ArrowLeft, Banknote, Building2, Camera, ChevronDown, CircleCheck,
  FileText, IdCard, ImagePlus, Images, Info, MapPin, MessageCircle, PhoneCall,
  Send, ShieldCheck, Star, Trash2, TriangleAlert, Upload, User, UserRound, Users, X,
  ClipboardCheck, Check, Search, Bold, Italic, List, ListOrdered, Heading2, Undo2, Redo2,
} from "lucide-react";
import locationsData from "./../../src/utility/locations..json";

const MIN_IMAGES = 1;
const MAX_IMAGES = 6;
const MAX_DESC = 500;
const MAX_SHOWN = 100;

type LocationEntry = { label: string; [key: string]: unknown };
const AREA_FILTER = "dhanmondi";
const ALL_LOCATIONS: LocationEntry[] = (locationsData as unknown as { entries: LocationEntry[] }).entries.filter(
  (l) => l.label.toLowerCase().includes(AREA_FILTER),
);

type Img = { id: string; url: string; file: File };
type Errors = Partial<Record<
  "images" | "rent" | "date" | "location" | "address" | "desc" | "name" | "phone" | "whatsapp" | "confirmed",
  string
>>;

const tenantOptions = [
  { id: "male", label: "পুরুষ (Male)", icon: User },
  { id: "female", label: "মহিলা (Female)", icon: UserRound },
  { id: "family", label: "ফ্যামিলি / যে কেউ", icon: Users },
] as const;

const bn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const BD_MOBILE = /^1[3-9]\d{8}$/; // number after +880
const cleanPhone = (v: string) => v.replace(/\D/g, "").replace(/^0/, "").slice(0, 10);

/* ---------- small UI helpers ---------- */

function Card({ icon, title, subtitle, badge, children }: {
  icon: ReactNode; title: string; subtitle?: string; badge?: ReactNode; children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-blue-50 text-blue-600">{icon}</span>
          <div className="leading-tight">
            <h2 className="text-[14px] font-bold text-slate-900 sm:text-[15px]">{title}</h2>
            {subtitle && <p className="text-[11px] font-medium text-blue-600">{subtitle}</p>}
          </div>
        </div>
        {badge}
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex shrink-0 items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
    {children}
  </span>
);

function Field({ id, label, error, hint, children }: {
  id: string; label: string; error?: string; hint?: ReactNode; children: ReactNode;
}) {
  return (
    <div id={`field-${id}`} className="scroll-mt-24">
      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-red-600">
          <TriangleAlert size={12} /> {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">{hint}</p>
      )}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full rounded border px-3 py-2.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
    err
      ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-100"
      : "border-slate-300 bg-white focus:border-blue-600 focus:ring-blue-100"
  }`;

/* ---------- rich text editor (Tiptap) ---------- */

function ToolbarBtn({ label, active, disabled, onClick, children }: {
  label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep editor focus
      onClick={onClick}
      className={`grid h-8 w-8 place-items-center rounded transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const Divider = () => <span className="mx-1 h-5 w-px bg-slate-200" />;
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
      <ToolbarBtn label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={16} />
      </ToolbarBtn>
      <ToolbarBtn label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={16} />
      </ToolbarBtn>
      <ToolbarBtn label="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={16} />
      </ToolbarBtn>
      <Divider />
      <ToolbarBtn label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={16} />
      </ToolbarBtn>
      <ToolbarBtn label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </ToolbarBtn>
      <Divider />
      <ToolbarBtn label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 size={16} />
      </ToolbarBtn>
      <ToolbarBtn label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 size={16} />
      </ToolbarBtn>
    </div>
  );
}

type RichTextEditorProps = {
  onChange: (html: string, textLength: number) => void;
  error?: string;
  placeholder?: string;
  maxLength: number;
};

/* The real editor. Only ever rendered in the browser (see RichTextEditor below). */
function RichTextEditorInner({ onChange, error, placeholder, maxLength }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
        // only keep the essentials
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: maxLength }),
    ],
    content: "",
    immediatelyRender: false, // avoids Next.js SSR hydration mismatch
    editorProps: {
      attributes: {
        class: "min-h-[150px] max-h-[320px] overflow-y-auto px-3 py-2.5 text-[13px] leading-relaxed text-slate-900 outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : editor.getHTML(), editor.getText().length);
    },
  });

  return (
    <div
      className={`overflow-hidden rounded border bg-white transition focus-within:ring-2 ${
        error
          ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-100"
          : "border-slate-300 focus-within:border-blue-600 focus-within:ring-blue-100"
      } [&_h2]:my-1 [&_h2]:text-[15px] [&_h2]:font-bold [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:text-slate-400 [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]`}
    >
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}


function RichTextEditor(props: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // placeholder with a similar height so the layout doesn't jump
    return (
      <div
        className={`h-[195px] animate-pulse rounded border bg-slate-50 ${
          props.error ? "border-red-400" : "border-slate-300"
        }`}
      />
    );
  }

  return <RichTextEditorInner {...props} />;
}

/* ---------- searchable location dropdown ---------- */

function LocationSelect({ value, onChange, error }: {
  value: LocationEntry | null; onChange: (v: LocationEntry) => void; error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    searchRef.current?.focus();
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return ALL_LOCATIONS;
    return ALL_LOCATIONS.filter((l) => terms.every((t) => l.label.toLowerCase().includes(t)));
  }, [q]);

  const pick = (item: LocationEntry) => {
    onChange(item);
    setOpen(false);
    setQ("");
  };

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`${inputCls(error)} flex items-center gap-2.5 text-left ${open ? "border-blue-600 ring-2 ring-blue-100" : ""}`}
      >
        <MapPin size={16} className="shrink-0 text-blue-600" />
        <span className={`flex-1 truncate ${value ? "font-medium" : "text-slate-400"}`}>
          {value ? value.label : "লোকেশন নির্বাচন করুন"}
        </span>
        <ChevronDown size={16} className={`shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded border border-slate-300 bg-white shadow-lg">
          <div className="relative border-b border-slate-200 p-2">
            <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="সার্চ করুন (যেমন: Dhanmondi)"
              className="w-full rounded border border-slate-300 py-2 pl-8 pr-3 text-[13px] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
            {results.length === 0 ? (
              <li className="px-3 py-4 text-center text-[13px] text-slate-500">কোনো লোকেশন পাওয়া যায়নি</li>
            ) : (
              results.slice(0, MAX_SHOWN).map((item, i) => {
                const selected = value?.label === item.label;
                return (
                  <li key={`${item.label}-${i}`} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => pick(item)}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] hover:bg-blue-50 ${
                        selected ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-700"
                      }`}
                    >
                      <span>{item.label}</span>
                      {selected && <Check size={15} className="shrink-0" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {results.length > MAX_SHOWN && (
            <p className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-500">
              {bn(MAX_SHOWN)}টি দেখানো হচ্ছে, মোট {bn(results.length)}টি। নির্দিষ্ট করতে আরও লিখে সার্চ করুন।
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- page ---------- */

const Page = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<Img[]>([]);
  const [active, setActive] = useState(0);
  const [propertyType, setPropertyType] = useState("sublet-1");
  const [tenant, setTenant] = useState<string>("family");
  const [rent, setRent] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState<LocationEntry | null>(null);
  const [address, setAddress] = useState("");
  const [desc, setDesc] = useState(""); // HTML from the editor
  const [descLen, setDescLen] = useState(0); // plain-text length
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  const [whatsapp, setWhatsapp] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [today, setToday] = useState("");

  // set on the client only (avoids the Next.js "current time" prerender error)
  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  /* validation: every field is required */
  const validate = (): Errors => {
    const e: Errors = {};
    if (images.length < MIN_IMAGES) e.images = "কমপক্ষে ১টি ছবি আপলোড করতে হবে।";
    if (!rent || Number(rent) <= 0) e.rent = "মাসিক ভাড়া লিখুন।";
    if (!date) e.date = "কবে থেকে উঠতে পারবে সেই তারিখ দিন।";
    if (!location) e.location = "লোকেশন নির্বাচন করুন।";
    if (!address.trim()) e.address = "পূর্ণ ঠিকানা লিখুন (ব্লক, রোড, বাড়ি নম্বর)।";
    else if (address.trim().length < 8) e.address = "ঠিকানা আরও বিস্তারিত লিখুন।";
    if (descLen === 0) e.desc = "বিশেষ বিবরণ লিখুন।";
    if (!name.trim()) e.name = "আপনার নাম লিখুন।";
    if (!phone) e.phone = "মোবাইল নম্বর লিখুন।";
    else if (!BD_MOBILE.test(phone)) e.phone = "সঠিক নম্বর দিন (যেমন: 1XXXXXXXXX, ১০ ডিজিট)।";
    if (!sameWhatsapp) {
      if (!whatsapp) e.whatsapp = "WhatsApp নম্বর লিখুন।";
      else if (!BD_MOBILE.test(whatsapp)) e.whatsapp = "সঠিক নম্বর দিন (যেমন: 1XXXXXXXXX, ১০ ডিজিট)।";
    }
    if (!confirmed) e.confirmed = "পোস্ট করতে তথ্য নিশ্চিত করতে হবে।";
    return e;
  };
  const errors: Errors = submitted ? validate() : {};

  /* images */
  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const picked: Img[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        url: URL.createObjectURL(file),
        file,
      }));
    setImages((prev) => [...prev, ...picked].slice(0, MAX_IMAGES));
    if (fileRef.current) fileRef.current.value = "";
  };
  const removeImage = (i: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, idx) => idx !== i);
    });
    setActive(0);
  };

  /* submit */
  const handleSubmit = () => {
    setSubmitted(true);
    const e = validate();
    const order: (keyof Errors)[] = ["images", "rent", "date", "location", "address", "desc", "name", "phone", "whatsapp", "confirmed"];
    const first = order.find((k) => e[k]);
    if (first) {
      document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const payload = {
      images: images.map((i) => i.file),
      propertyType,
      tenantType: tenant,
      monthlyRent: Number(rent),
      availableFrom: date,
      location: location?.label,
      locationData: location, // full entry from locations JSON
      fullAddress: address.trim(),
      description: desc, // HTML string from the rich text editor
      contactName: name.trim(),
      phone: `+880${phone}`,
      whatsapp: sameWhatsapp ? `+880${phone}` : `+880${whatsapp}`,
      confirmed,
    };
    console.log("✅ Post Ad – form data:", payload);
    // TODO: send `payload` to your API (use FormData for the image files)
    // NOTE: sanitize `description` HTML on the server (e.g. sanitize-html) before saving/rendering.
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:grid-cols-12 lg:items-start">
        {/* LEFT: photos */}
        <div className="lg:sticky lg:top-20 lg:col-span-5">
          <Card
            icon={<Camera size={18} />}
            title="বাসার ছবি যুক্ত করুন"
            badge={<Badge>ন্যূনতম ১টি, সর্বোচ্চ ৬টি</Badge>}
          >
            <div id="field-images" className="scroll-mt-24">
              {images.length === 0 ? (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={`flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded border-2 border-dashed text-center transition hover:bg-blue-50 ${
                    errors.images ? "border-red-400 bg-red-50/40" : "border-slate-300 bg-slate-50"
                  }`}
                >
                  <ImagePlus size={34} className="text-blue-600" />
                  <span className="text-[13px] font-semibold text-slate-700">ছবি যুক্ত করতে ট্যাপ করুন</span>
                  <span className="text-[11px] text-slate-500">JPG / PNG • প্রথম ছবিটি কভার হবে</span>
                </button>
              ) : (
                <>
                  <div className="relative aspect-[4/3] overflow-hidden rounded bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={images[active]?.url} alt="প্রধান ছবি" className="h-full w-full object-cover" />
                    {active === 0 && (
                      <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-[11px] font-bold text-white shadow">
                        <Star size={12} /> কভার ছবি
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(active)}
                      className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-[11px] font-bold text-white shadow hover:bg-red-700"
                    >
                      <Trash2 size={12} /> মুছুন
                    </button>
                    <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 text-[11px] font-semibold text-white">
                      <Images size={13} /> {bn(images.length)}/{bn(MAX_IMAGES)}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {images.map((img, i) => (
                      <div
                        key={img.id}
                        onClick={() => setActive(i)}
                        className={`relative aspect-square cursor-pointer overflow-hidden rounded border-2 ${
                          active === i ? "border-blue-600" : "border-transparent"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={`ছবি ${i + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          aria-label="ছবি মুছুন"
                          onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                          className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-white shadow"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                    {images.length < MAX_IMAGES && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex aspect-square flex-col items-center justify-center gap-1 rounded border-2 border-dashed border-blue-300 bg-blue-50/50 text-[11px] font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        <ImagePlus size={20} /> ছবি দিন
                      </button>
                    )}
                  </div>
                </>
              )}
              {errors.images && (
                <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-red-600">
                  <TriangleAlert size={12} /> {errors.images}
                </p>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={images.length >= MAX_IMAGES}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-blue-600 py-2.5 text-[13px] font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-transparent"
            >
              <Upload size={16} /> গ্যালারি থেকে আপলোড করুন
            </button>
          </Card>
        </div>

        {/* RIGHT: form */}
        <div className="grid gap-4 sm:gap-5 lg:col-span-7">
          <Card icon={<Building2 size={18} />} title="বাসার ধরন ও ভাড়াটিয়া">
            <div className="space-y-4">
              <Field id="propertyType" label="বাসার ধরন (Property Type)">
                <div className="relative">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className={`${inputCls()} appearance-none pr-9`}
                  >
                    <option value="sublet-1">সাবলেট / ১ রুম ভাড়া (Sublet - 1 Room)</option>
                    <option value="flat">ফ্ল্যাট ভাড়া (Flat)</option>
                    <option value="seat">সিট ভাড়া (Seat)</option>
                    <option value="office">অফিস / দোকান (Commercial)</option>
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </Field>

              <Field id="tenant" label="ভাড়াটিয়ার ধরন (কারা উঠতে পারবেন)">
                <div className="grid grid-cols-3 gap-2">
                  {tenantOptions.map(({ id, label, icon: Icon }) => {
                    const on = tenant === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTenant(id)}
                        className={`flex items-center justify-center gap-1.5 rounded border px-1.5 py-2 text-[11px] font-semibold transition sm:text-[12px] ${
                          on
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-blue-400"
                        }`}
                      >
                        <Icon size={15} className="shrink-0" /> <span className="truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </Card>

          <Card icon={<Banknote size={18} />} title="ভাড়া ও বিলের বিবরণ">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="rent" label="মাসিক ভাড়া (Rent)" error={errors.rent}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-slate-400">৳</span>
                  <input
                    inputMode="numeric"
                    placeholder="যেমন: 9000"
                    value={rent}
                    onChange={(e) => setRent(e.target.value.replace(/\D/g, ""))}
                    className={`${inputCls(errors.rent)} pl-8 font-semibold`}
                  />
                </div>
              </Field>
              <Field id="date" label="কবে থেকে উঠতে পারবে" error={errors.date}>
                <input
                  type="date"
                  min={today || undefined}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputCls(errors.date)}
                />
              </Field>
            </div>
          </Card>

          <Card
            icon={<MapPin size={18} />}
            title="লোকেশন ও এরিয়া"
            badge={<Badge><ShieldCheck size={12} /> শুধু এরিয়া দৃশ্যমান</Badge>}
          >
            <div className="space-y-4">
              <Field id="location" label="লোকেশন ক্রমানুসার (বিভাগ › জেলা › থানা › এরিয়া/রোড)" error={errors.location}>
                <LocationSelect value={location} onChange={setLocation} error={errors.location} />
              </Field>
              <Field
                id="address"
                label="পূর্ণ ঠিকানা (Full Address)"
                error={errors.address}
                hint={<><Info size={13} /> নিরাপত্তার স্বার্থে পূর্ণাঙ্গ ঠিকানা বা বাসা নম্বর প্রকাশ্যে দেখানো হয় না।</>}
              >
                <textarea
                  rows={3}
                  maxLength={200}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="যেমন: বাড়ি নং ১২, রোড নং ১৫, ব্লক-সি, ধানমন্ডি, ঢাকা"
                  className={`${inputCls(errors.address)} resize-none leading-relaxed`}
                />
              </Field>
            </div>
          </Card>

          <Card
            icon={<FileText size={18} />}
            title="বিশেষ বিবরণ (Description)"
            badge={<span className="text-[11px] font-semibold text-slate-400">{bn(descLen)} / {bn(MAX_DESC)}</span>}
          >
            <Field id="desc" label="বাসার বিস্তারিত বিবরণ" error={errors.desc}>
              <RichTextEditor
                error={errors.desc}
                maxLength={MAX_DESC}
                placeholder="তলা, রুম সংখ্যা, বারান্দা, বাথরুম, গ্যাস-পানি-লিফট ইত্যাদি সুবিধার কথা লিখুন"
                onChange={(html, len) => {
                  setDesc(html);
                  setDescLen(len);
                }}
              />
            </Field>
          </Card>

          <Card icon={<IdCard size={18} />} title="আপনার যোগাযোগের তথ্য">
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="name" label="আপনার নাম (Name)" error={errors.name}>
                <input
                  value={name}
                  placeholder="আপনার পুরো নাম"
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls(errors.name)}
                />
              </Field>
              <Field
                id="phone"
                label="মোবাইল নম্বর (সরাসরি কলের জন্য)"
                error={errors.phone}
                hint={<><PhoneCall size={13} /> ভাড়াটিয়ারা এই নম্বরে সরাসরি কল করবেন</>}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-slate-500">+880</span>
                  <input
                    inputMode="tel"
                    placeholder="1XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(cleanPhone(e.target.value))}
                    className={`${inputCls(errors.phone)} pl-14`}
                  />
                </div>
              </Field>
            </div>

            <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3.5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={sameWhatsapp}
                  onChange={(e) => setSameWhatsapp(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-blue-600"
                />
                <span>
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
                    <MessageCircle size={16} className="text-emerald-500" /> এই নম্বরটিতেই হোয়াটসঅ্যাপ (WhatsApp) রয়েছে
                  </span>
                  <span className="mt-0.5 block text-[11px] text-slate-500">
                    ভাড়াটিয়ারা সরাসরি এই নম্বরে WhatsApp মেসেজ দিতে পারবেন
                  </span>
                </span>
              </label>

              {!sameWhatsapp && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <Field id="whatsapp" label="WhatsApp নম্বর" error={errors.whatsapp}>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-slate-500">+880</span>
                      <input
                        inputMode="tel"
                        placeholder="1XXXXXXXXX"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(cleanPhone(e.target.value))}
                        className={`${inputCls(errors.whatsapp)} pl-14`}
                      />
                    </div>
                  </Field>
                </div>
              )}
            </div>
          </Card>

          <Card
            icon={<ClipboardCheck size={18} />}
            title="বিজ্ঞাপন প্রকাশের পূর্বে তথ্য যাচাই করুন"
            subtitle="Review Before Posting"
            badge={<Badge>জরুরি চেক</Badge>}
          >
            <ul className="space-y-2.5 rounded border border-slate-200 bg-slate-50 p-3.5 text-[13px] text-slate-700">
              <li className="flex items-start gap-2.5">
                <CircleCheck size={16} className="mt-0.5 shrink-0 text-blue-600" />
                সকল ভাড়া, বিল ও লোকেশনের তথ্য সঠিক আছে কিনা দেখে নিন।
              </li>
              <li className="flex items-start gap-2.5">
                <CircleCheck size={16} className="mt-0.5 shrink-0 text-blue-600" />
                সরাসরি কল ও WhatsApp নম্বর সক্রিয় এবং সঠিক প্রদান করেছেন।
              </li>
              <li className="flex items-start gap-2.5">
                <TriangleAlert size={16} className="mt-0.5 shrink-0 text-red-500" />
                ভুল তথ্য বা বিভ্রান্তিকর বিজ্ঞাপন বাতিল করা হতে পারে।
              </li>
            </ul>

            <div id="field-confirmed" className="mt-4 scroll-mt-24">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded border p-3.5 ${
                  errors.confirmed ? "border-red-400 bg-red-50/40" : "border-blue-200 bg-blue-50/60"
                }`}
              >
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                />
                <span className="text-[13px] font-medium text-slate-800">
                  আমি আমার দেওয়া সকল তথ্য ও ছবি ভালোভাবে চেক করেছি এবং তা সম্পূর্ণ সঠিক ও সত্য।
                </span>
              </label>
              {errors.confirmed && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-red-600">
                  <TriangleAlert size={12} /> {errors.confirmed}
                </p>
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:justify-end">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded border border-slate-300 px-5 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 lg:px-8"
          >
            <ArrowLeft size={16} /> বাতিল
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex flex-1 items-center justify-center gap-2 rounded bg-blue-600 px-6 py-2.5 text-[13px] font-bold text-white transition hover:bg-blue-700 lg:max-w-xs lg:flex-none lg:px-10"
          >
            <Send size={16} /> বিজ্ঞাপন পোস্ট করুন (Free)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;