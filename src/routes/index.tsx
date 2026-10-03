import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Crown,
  Instagram,
  LocateFixed,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Scissors,
  X,
} from "lucide-react";

import equipmentImage from "../assets/joker-equipment.jpg";
import logo from "../assets/joker-logo.png";
import salon from "../assets/joker-salon.jpg";
import products from "../assets/joker-products.jpg";
import mapShot from "../assets/joker-map.jpg";
import { createBooking } from "@/lib/bookings.functions";

type Language = "en" | "fr" | "ar";
type Media = { kind: "image" | "video"; src: string; poster?: string };

const phoneDisplay = "06 84 42 39 74";
const whatsappNumber = "212684423974";
const instagramUrl = "https://www.instagram.com/1joker_barber?stkn=aDlsbXUycjBzZXJ0";
const mapUrl = "https://maps.app.goo.gl/mqdXrJfZkBGEpUuHA?g_st=aw";

const img = (src: string): Media => ({ kind: "image", src });
const serviceMedia: Media[] = [
  img(equipmentImage),
  img(salon),
  img(products),
  img(products),
  img(salon),
  img(products),
  img(equipmentImage),
];
const productMedia: Media[] = [img(equipmentImage), img(products), img(salon)];
const fallbackMedia = img(salon);

function MediaView({ media, className }: { media: Media; className?: string }) {
  return media.kind === "video" ? (
    <video src={media.src} poster={media.poster} autoPlay muted loop playsInline preload="metadata" className={className} />
  ) : (
    <img src={media.src} alt="Joker Barber" loading="lazy" className={className} />
  );
}

const copy = {
  en: {
    nav: ["Services", "Our work", "Equipment", "About"],
    book: "Book now",
    eyebrow: "BARBERING — RABAT",
    titleA: "Sharp cuts.",
    titleB: "Made personal.",
    intro: "Precision barbering in Hay Al Wahda, Rabat. Clean fades, sharp lines and an experience built around your style.",
    bookChair: "Book a chair",
    location: "HAY AL WAHDA · RABAT",
    direct: "DIRECT BOOKING",
    whatsapp: "CONFIRMED ON WHATSAPP",
    services: "Services & prices",
    menu: "MENU",
    askPrice: "Ask for price",
    menuService: "Service",
    menuPrice: "Price",
    serviceNames: [
      { name: "Haircut + mask", price: "40 DH" },
      { name: "Facial cleansing", price: "80 DH" },
      { name: "Haircut + facial care", price: "100 DH" },
      { name: "Protein treatment", price: "200 DH" },
      { name: "Facial waxing", price: "20 DH" },
      { name: "Shampoo + complimentary blow-dry", price: "15 DH" },
      { name: "Complete package", price: "250 DH" },
    ],
    gallery: "The work",
    galleryText: "A closer look at the detail, finish and craft behind every appointment.",
    instagram: "See more on Instagram",
    equipment: "Barber equipment",
    equipmentText: "Professional essentials selected for barbers who care about clean tools and consistent results.",
    products: ["Clippers & trimmers", "Scissors & combs", "Brushes & accessories"],
    askWhatsapp: "Ask on WhatsApp",
    about: "About",
    aboutTitle: "One chair. One standard.",
    aboutText: "Joker Barber is a neighborhood barbershop in Hay Al Wahda, Rabat, focused on precise work, personal service and a clean finish.",
    reviewTitle: "Already visited us?",
    reviewText: "Share your latest cut and tag @1joker_barber. Your look could be featured here.",
    follow: "Follow Joker Barber",
    booking: "BOOKING",
    reserve: "Reserve your chair.",
    reserveText: "Choose your service and preferred time. Your request opens in WhatsApp for quick confirmation.",
    name: "Name",
    phone: "Phone",
    service: "Service",
    date: "Date",
    time: "Time",
    choose: "Choose a service",
    send: "Send booking request",
    find: "Find us",
    address: "Hay Al Wahda, Rabat",
    directions: "Open in Google Maps",
    contact: "CONTACT",
    visit: "VISIT",
    rights: "All rights reserved.",
    bookingMessage: "Hello Joker Barber, I would like to book an appointment.",
    customer: "Name",
    preferred: "Preferred",
    shopMessage: "Hello Joker Barber, I would like information about",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    locationLabel: "Location / address",
    useLocation: "Use my current location",
    locating: "Locating…",
    locationFail: "Couldn't get your location — please type it.",
    close: "Close",
    reserveThis: "Book this service",
    taken: "This time is already taken. Next free time:",
    past: "Please choose a future date and time.",
    sending: "Checking availability…",
    mapLink: "Map",
  },
  fr: {
    nav: ["Services", "Nos réalisations", "Équipement", "À propos"],
    book: "Réserver",
    eyebrow: "BARBIER — RABAT",
    titleA: "Coupes nettes.",
    titleB: "Style personnel.",
    intro: "Barbier de précision à Hay Al Wahda, Rabat. Dégradés nets, contours soignés et service adapté à votre style.",
    bookChair: "Réserver un fauteuil",
    location: "HAY AL WAHDA · RABAT",
    direct: "RÉSERVATION DIRECTE",
    whatsapp: "CONFIRMATION SUR WHATSAPP",
    services: "Services & tarifs",
    menu: "MENU",
    askPrice: "Demander le prix",
    menuService: "Service",
    menuPrice: "Prix",
    serviceNames: [
      { name: "Coupe + masque", price: "40 DH" },
      { name: "Nettoyage du visage", price: "80 DH" },
      { name: "Coupe + soins du visage", price: "100 DH" },
      { name: "Soin protéiné", price: "200 DH" },
      { name: "Cire visage", price: "20 DH" },
      { name: "Shampoing + brushing offert", price: "15 DH" },
      { name: "Pack complet", price: "250 DH" },
    ],
    gallery: "Nos réalisations",
    galleryText: "Un aperçu du détail, de la finition et du savoir-faire derrière chaque rendez-vous.",
    instagram: "Voir plus sur Instagram",
    equipment: "Équipement de barbier",
    equipmentText: "Des essentiels professionnels pour les barbiers qui exigent des outils propres et des résultats réguliers.",
    products: ["Tondeuses & finitions", "Ciseaux & peignes", "Brosses & accessoires"],
    askWhatsapp: "Demander sur WhatsApp",
    about: "À PROPOS",
    aboutTitle: "Un fauteuil. Un standard.",
    aboutText: "Joker Barber est un salon de quartier à Hay Al Wahda, Rabat, consacré au travail précis, au service personnalisé et aux finitions nettes.",
    reviewTitle: "Déjà venu chez nous ?",
    reviewText: "Partagez votre dernière coupe et identifiez @1joker_barber. Votre look pourra apparaître ici.",
    follow: "Suivre Joker Barber",
    booking: "RÉSERVATION",
    reserve: "Réservez votre fauteuil.",
    reserveText: "Choisissez votre service et l’horaire souhaité. La demande s’ouvre sur WhatsApp pour une confirmation rapide.",
    name: "Nom",
    phone: "Téléphone",
    service: "Service",
    date: "Date",
    time: "Heure",
    choose: "Choisir un service",
    send: "Envoyer la demande",
    find: "Nous trouver",
    address: "Hay Al Wahda, Rabat",
    directions: "Ouvrir dans Google Maps",
    contact: "CONTACT",
    visit: "ADRESSE",
    rights: "Tous droits réservés.",
    bookingMessage: "Bonjour Joker Barber, je souhaite réserver un rendez-vous.",
    customer: "Nom",
    preferred: "Créneau souhaité",
    shopMessage: "Bonjour Joker Barber, je souhaite des informations sur",
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    locationLabel: "Localisation / adresse",
    useLocation: "Utiliser ma position actuelle",
    locating: "Localisation…",
    locationFail: "Position introuvable — veuillez la saisir.",
    close: "Fermer",
    reserveThis: "Réserver ce service",
    taken: "Ce créneau est déjà pris. Prochain créneau libre :",
    past: "Veuillez choisir une date et une heure à venir.",
    sending: "Vérification de la disponibilité…",
    mapLink: "Carte",
  },
  ar: {
    nav: ["الخدمات", "أعمالنا", "معدات الحلاقة", "من نحن"],
    book: "احجز الآن",
    eyebrow: "حلاقة احترافية — الرباط",
    titleA: "حلاقة دقيقة.",
    titleB: "أسلوبك الخاص.",
    intro: "حلاقة احترافية في حي الوحدة بالرباط. تدرجات نظيفة، تحديد دقيق، وتجربة تناسب أسلوبك.",
    bookChair: "احجز موعدك",
    location: "حي الوحدة · الرباط",
    direct: "حجز مباشر",
    whatsapp: "التأكيد عبر واتساب",
    services: "الخدمات والأسعار",
    menu: "القائمة",
    askPrice: "اسأل عن السعر",
    menuService: "الخدمة",
    menuPrice: "السعر",
    serviceNames: [
      { name: "حلاقة + ماسك", price: "40 DH" },
      { name: "تنظيف الوجه", price: "80 DH" },
      { name: "حلاقة + عناية بالوجه", price: "100 DH" },
      { name: "علاج البروتين", price: "200 DH" },
      { name: "إزالة شعر الوجه بالشمع", price: "20 DH" },
      { name: "شامبو + تصفيف مجاني", price: "15 DH" },
      { name: "الباقة الكاملة", price: "250 DH" },
    ],
    gallery: "أعمالنا",
    galleryText: "نظرة أقرب على الدقة واللمسات النهائية والمهارة في كل موعد.",
    instagram: "شاهد المزيد على إنستغرام",
    equipment: "معدات الحلاقة",
    equipmentText: "أساسيات احترافية للحلاقين الذين يهتمون بجودة الأدوات وثبات النتائج.",
    products: ["ماكينات الحلاقة والتحديد", "المقصات والأمشاط", "الفُرش والإكسسوارات"],
    askWhatsapp: "اسأل عبر واتساب",
    about: "من نحن",
    aboutTitle: "كرسي واحد. معيار واحد.",
    aboutText: "جوكر باربر صالون حلاقة في حي الوحدة بالرباط، يهتم بالدقة والخدمة الشخصية والنتيجة النظيفة.",
    reviewTitle: "زرتنا من قبل؟",
    reviewText: "شارك حلاقتك الجديدة واذكر @1joker_barber. قد نعرض إطلالتك هنا.",
    follow: "تابع جوكر باربر",
    booking: "الحجز",
    reserve: "احجز كرسيك.",
    reserveText: "اختر الخدمة والوقت المناسب. سيفتح طلبك في واتساب للتأكيد السريع.",
    name: "الاسم",
    phone: "الهاتف",
    service: "الخدمة",
    date: "التاريخ",
    time: "الوقت",
    choose: "اختر خدمة",
    send: "إرسال طلب الحجز",
    find: "موقعنا",
    address: "حي الوحدة، الرباط",
    directions: "فتح في خرائط Google",
    contact: "اتصل بنا",
    visit: "العنوان",
    rights: "جميع الحقوق محفوظة.",
    bookingMessage: "مرحباً جوكر باربر، أود حجز موعد.",
    customer: "الاسم",
    preferred: "الموعد المفضل",
    shopMessage: "مرحباً جوكر باربر، أود معلومات عن",
    menuOpen: "فتح القائمة",
    menuClose: "إغلاق القائمة",
    locationLabel: "الموقع / العنوان",
    useLocation: "استخدم موقعي الحالي",
    locating: "جارٍ تحديد الموقع…",
    locationFail: "تعذر تحديد موقعك — يرجى كتابته.",
    close: "إغلاق",
    reserveThis: "احجز هذه الخدمة",
    taken: "هذا الوقت محجوز. أقرب وقت متاح:",
    past: "يرجى اختيار تاريخ ووقت قادمين.",
    sending: "جارٍ التحقق من التوفر…",
    mapLink: "الخريطة",
  },
} as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Joker Barber Rabat | Barber Shop in Hay Al Wahda" },
      { name: "description", content: "Book a precision haircut at Joker Barber in Hay Al Wahda, Rabat. Explore our work and professional barber equipment." },
      { property: "og:title", content: "Joker Barber — Rabat" },
      { property: "og:description", content: "Precision cuts, beard care and professional barber equipment in Hay Al Wahda, Rabat." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function whatsappUrl(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function SectionHeading({ title, code }: { title: string; code: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
      <h2 className="font-display text-3xl uppercase leading-none md:text-4xl">{title}</h2>
      <span className="font-mono text-[10px] uppercase text-muted md:text-xs">({code})</span>
    </div>
  );
}

function Index() {
  const [language, setLanguage] = useState<Language>("fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState<{ title: string; price?: string; media: Media; serviceIndex?: number } | null>(null);
  const [serviceIndex, setServiceIndex] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const book = useServerFn(createBooking);
  const t = copy[language];
  const isArabic = language === "ar";

  const sectionLinks = useMemo(
    () => [
      ["#services", t.nav[0]],
      ["#gallery", t.nav[1]],
      ["#equipment", t.nav[2]],
      ["#about", t.nav[3]],
    ],
    [t],
  );

  function useMyLocation() {
    if (!navigator.geolocation) return setStatus(t.locationFail);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c);
        setAddress(`${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}`);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setStatus(t.locationFail);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const index = Number(serviceIndex);
    const service = t.serviceNames[index];
    if (!service) {
      setStatus(t.choose);
      return;
    }
    const date = String(form.get("date") ?? "");
    const time = String(form.get("time") ?? "");
    setBusy(true);
    setStatus(t.sending);
    const popup = window.open("", "_blank");
    try {
      const result = await book({
        data: {
          serviceIndex: index,
          startsAt: new Date(`${date}T${time}`).toISOString(),
          address: address || undefined,
          lat: coords?.lat,
          lng: coords?.lng,
        },
      });
      if (!result.ok) {
        popup?.close();
        if (result.reason === "past") return setStatus(t.past);
        const next = new Date(result.nextFree ?? "");
        return setStatus(`${t.taken} ${next.toLocaleString(language === "ar" ? "ar-MA" : language, { dateStyle: "short", timeStyle: "short" })}`);
      }
      const point = coords ?? result.point;
      const message = [
        t.bookingMessage,
        `${t.customer}: ${String(form.get("name") ?? "")}`,
        `${t.phone}: ${String(form.get("phone") ?? "")}`,
        `${t.service}: ${service.name} — ${service.price}`,
        `${t.preferred}: ${date} ${time}`,
        `${t.locationLabel}: ${address}`,
        point ? `${t.mapLink}: https://maps.google.com/?q=${point.lat},${point.lng}` : "",
      ].filter(Boolean).join("\n");
      const url = whatsappUrl(message);
      if (popup) popup.location.href = url;
      else window.location.href = url;
      setStatus(null);
    } catch {
      popup?.close();
      setStatus(t.locationFail);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div dir={isArabic ? "rtl" : "ltr"} lang={language} className={isArabic ? "font-ar" : "font-body"}>
      <header className="sticky top-0 z-50 border-b border-line/70 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-5">
          <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="Joker Barber home">
            <img src={logo} alt="Joker Barber logo" className="size-9 rounded-full border border-accent/50 object-cover" />
            <span className="leading-none">
              <span className="block font-display text-lg uppercase text-frost">Joker Barber</span>
              <span className="mt-0.5 block font-mono text-[8px] text-muted">RABAT · MA</span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-muted lg:flex" aria-label="Primary navigation">
            {sectionLinks.map(([href, label]) => <a key={href} href={href} className="transition-colors hover:text-frost">{label}</a>)}
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-line bg-panel p-0.5 text-[11px] font-semibold" aria-label="Language">
              {(["fr", "en", "ar"] as Language[]).map((code) => (
                <button key={code} type="button" onClick={() => setLanguage(code)} aria-pressed={language === code} className={`min-w-8 rounded px-2 py-1.5 uppercase transition-colors ${language === code ? "bg-frost text-ink" : "text-muted hover:text-frost"}`}>{code === "ar" ? "ع" : code}</button>
              ))}
            </div>
            <a href="#book" className="hidden rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground transition-colors hover:bg-frost sm:inline-flex">{t.book}</a>
            <button type="button" className="grid size-9 place-items-center rounded-md border border-line text-frost lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? t.menuClose : t.menuOpen}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-line bg-ink px-4 py-4 lg:hidden" aria-label="Mobile navigation">
            <div className="mx-auto grid max-w-6xl gap-1">
              {sectionLinks.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-3 text-sm text-muted hover:bg-panel hover:text-frost">{label}</a>)}
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="relative overflow-hidden border-b border-line/70">
          <div className="ambient-light" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-end gap-10 px-5 pb-14 pt-14 lg:grid-cols-12 lg:pt-20">
            <div className="lg:col-span-7">
              <p className="reveal font-mono text-[10px] uppercase text-accent md:text-xs">{t.eyebrow}</p>
              <h1 className="reveal delay-1 mt-5 font-display text-[clamp(4.2rem,11vw,8rem)] uppercase leading-[0.84] text-frost">
                {t.titleA}<br /><span className="text-accent">{t.titleB}</span>
              </h1>
              <p className="reveal delay-2 mt-7 max-w-xl text-base leading-7 text-muted">{t.intro}</p>
              <div className="reveal delay-3 mt-8 flex flex-wrap gap-3">
                <a href="#book" className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-bold text-accent-foreground transition-colors hover:bg-frost"><CalendarDays size={17} />{t.bookChair}</a>
                <a href="tel:0684423974" className="inline-flex items-center gap-2 rounded-md border border-line bg-panel/60 px-5 py-3 font-mono text-sm text-accent transition-colors hover:border-frost/50"><Phone size={16} />{phoneDisplay}</a>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[10px] uppercase text-muted md:text-xs">
                <span>{t.location}</span><span>{t.direct}</span><span className="text-accent">{t.whatsapp}</span>
              </div>
            </div>
            <div className="reveal delay-2 lg:col-span-5">
              <div className="relative overflow-hidden rounded-xl border border-frost/10 bg-panel">
                <img src={salon} alt="Inside Joker Barber in Rabat" fetchPriority="high" className="aspect-[4/5] w-full object-cover" />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-lg border border-frost/10 bg-ink/80 px-4 py-3 backdrop-blur-md">
                  <span className="font-mono text-[9px] uppercase text-muted">Joker Barber</span>
                  <span className="font-mono text-[9px] uppercase text-accent">Hay Al Wahda · Rabat</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
          <SectionHeading title={t.services} code={`A · ${t.menu}`} />
          <div className="menu-board mt-7">
            <div className="menu-board-inner">
              <div className="flex flex-col items-center border-b border-accent/50 px-4 pb-6 text-center">
                <Crown size={28} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
                <p className="mt-2 font-display text-3xl uppercase text-accent md:text-4xl">Joker Barber</p>
                <div className="mt-3 flex items-center gap-3 text-accent/70" aria-hidden="true"><span className="h-px w-12 bg-accent/50" /><Scissors size={17} /><span className="h-px w-12 bg-accent/50" /></div>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-5 border-b border-accent/50 px-4 py-3 font-display text-lg uppercase text-accent md:px-7 md:text-2xl">
                <span>{t.menuService}</span><span>{t.menuPrice}</span>
              </div>
              <div>
                {t.serviceNames.map((service, index) => (
                  <button key={service.name} type="button" onClick={() => setPreview({ title: service.name, price: service.price, media: serviceMedia[index] ?? fallbackMedia, serviceIndex: index })} className="group grid min-h-16 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 border-b border-accent/25 px-4 py-3 text-start last:border-b-0 md:px-7">
                    <span className="flex min-w-0 items-center gap-3 font-medium text-frost"><span className="font-mono text-[9px] text-accent/70">0{index + 1}</span><span>{service.name}</span></span>
                    <span className="whitespace-nowrap font-display text-xl text-accent md:text-2xl">{service.price}</span>
                  </button>
                ))}
              </div>
              <a href="tel:0684423974" className="flex items-center justify-center gap-3 border-t border-accent/50 px-4 pt-6 font-mono text-sm text-accent transition-colors hover:text-frost"><Phone size={17} />Ayman · {phoneDisplay}</a>
            </div>
          </div>
        </section>

        <section id="gallery" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-20">
          <SectionHeading title={t.gallery} code="B · INSTAGRAM" />
          <div className="mt-7 grid gap-4 md:grid-cols-12">
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-lg md:col-span-7">
              <MediaView media={serviceMedia[0] ?? fallbackMedia} className="aspect-[5/4] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-md bg-ink/80 px-3 py-2 text-xs text-frost backdrop-blur"><Instagram size={15} />@1joker_barber</span>
            </a>
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="group relative overflow-hidden rounded-lg md:col-span-5">
              <MediaView media={serviceMedia[2] ?? fallbackMedia} className="aspect-[5/4] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
            </a>
          </div>
          <div className="mt-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-xl text-sm leading-6 text-muted">{t.galleryText}</p>
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-frost"><Instagram size={17} />{t.instagram}<ArrowUpRight size={15} /></a>
          </div>
        </section>

        <section id="equipment" className="border-y border-line/70 bg-panel/45">
          <div className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
            <SectionHeading title={t.equipment} code="C · SHOP" />
            <div className="mt-7 grid gap-8 lg:grid-cols-12 lg:items-stretch">
              <div className="overflow-hidden rounded-lg lg:col-span-7">
                <img src={equipmentImage} alt="Professional barber clippers, scissors, comb and brush" width={1024} height={768} loading="lazy" className="h-full min-h-72 w-full object-cover" />
              </div>
              <div className="flex flex-col lg:col-span-5">
                <p className="mb-5 text-sm leading-6 text-muted">{t.equipmentText}</p>
                <div className="border-t border-line">
                  {t.products.map((product, index) => (
                    <button key={product} type="button" onClick={() => setPreview({ title: product, media: productMedia[index] ?? fallbackMedia })} className="group flex w-full items-center justify-between gap-4 border-b border-line py-5 text-start">
                      <span><span className="mb-1 block font-mono text-[9px] text-muted">0{index + 1}</span><span className="font-semibold text-frost">{product}</span></span>
                       <span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground transition-colors group-hover:bg-frost"><ArrowUpRight size={17} /></span>
                     </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-6xl scroll-mt-24 gap-5 px-5 py-20 lg:grid-cols-12">
          <div className="border-t border-line pt-6 lg:col-span-7">
            <p className="font-mono text-[10px] uppercase text-accent">(D) {t.about}</p>
            <h2 className="mt-4 max-w-xl font-display text-5xl uppercase leading-none text-frost md:text-6xl">{t.aboutTitle}</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted">{t.aboutText}</p>
          </div>
          <div className="rounded-lg border border-line bg-panel p-6 lg:col-span-5">
            <Instagram className="text-accent" size={23} />
            <h3 className="mt-5 text-xl font-semibold text-frost">{t.reviewTitle}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{t.reviewText}</p>
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-frost">{t.follow}<ArrowUpRight size={15} /></a>
          </div>
        </section>

        <section id="book" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-20">
          <div className="relative overflow-hidden rounded-xl border border-frost/10 bg-panel p-6 md:p-10">
            <div className="booking-light" aria-hidden="true" />
            <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="font-mono text-[10px] uppercase text-accent">(E) {t.booking}</span>
                <h2 className="mt-4 font-display text-5xl uppercase leading-none text-frost md:text-6xl">{t.reserve}</h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-muted">{t.reserveText}</p>
              </div>
              <form onSubmit={submitBooking} className="grid gap-4 rounded-lg border border-line bg-ink/60 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="field-label">{t.name}<input name="name" required autoComplete="name" className="field" /></label>
                  <label className="field-label">{t.phone}<input name="phone" type="tel" required autoComplete="tel" className="field" /></label>
                </div>
                <label className="field-label">{t.service}<span className="relative mt-2 block"><select name="service" required value={serviceIndex} onChange={(event) => setServiceIndex(event.target.value)} className="field mt-0 appearance-none pr-10"><option value="" disabled>{t.choose}</option>{t.serviceNames.map((service, index) => <option key={service.name} value={index}>{service.name} — {service.price}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" /></span></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="field-label">{t.date}<input name="date" type="date" required className="field" /></label>
                  <label className="field-label">{t.time}<input name="time" type="time" required className="field" /></label>
                </div>
                <label className="field-label">{t.locationLabel}<input name="location" required value={address} onChange={(event) => { setAddress(event.target.value); setCoords(null); }} autoComplete="street-address" className="field" /></label>
                <button type="button" onClick={useMyLocation} disabled={locating} className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-frost hover:border-accent disabled:opacity-60"><LocateFixed size={17} />{locating ? t.locating : t.useLocation}</button>
                {status && <p role="status" className="text-sm text-accent">{status}</p>}
                <button type="submit" disabled={busy} className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 font-bold text-accent-foreground transition-colors hover:bg-frost disabled:opacity-60"><MessageCircle size={18} />{busy ? t.sending : t.send}</button>
              </form>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-panel/40">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-2 md:items-center">
            <div>
              <span className="font-mono text-[10px] uppercase text-accent">(F) {t.find}</span>
              <h2 className="mt-4 font-display text-5xl uppercase leading-none text-frost">{t.address}</h2>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-foreground hover:bg-frost"><MapPin size={17} />{t.directions}</a>
                <a href="tel:0684423974" className="inline-flex items-center gap-2 rounded-md border border-line px-5 py-3 font-mono text-sm text-frost hover:border-frost"><Phone size={16} />{phoneDisplay}</a>
              </div>
            </div>
            <a href={mapUrl} target="_blank" rel="noreferrer" className="group relative block aspect-[3/2] overflow-hidden rounded-lg border border-line bg-ink">
              <img src={mapShot} alt="Map showing Joker Barber in Rabat" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              <span className="absolute bottom-3 start-3 inline-flex items-center gap-2 rounded-md bg-ink/85 px-3 py-1.5 text-xs font-semibold text-frost backdrop-blur">Hay Al Wahda, Rabat<ArrowUpRight size={14} /></span>
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-ink">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-3">
          <div className="flex items-start gap-3"><img src={logo} alt="Joker Barber logo" className="size-12 rounded-full border border-accent/50 object-cover" /><div><p className="font-display text-2xl uppercase text-frost">Joker Barber</p><p className="mt-2 font-mono text-[10px] text-muted">jokerbarber.ma</p></div></div>
          <div><p className="font-mono text-[10px] text-muted">{t.contact}</p><a href="tel:0684423974" className="mt-2 block text-sm text-frost hover:text-accent">{phoneDisplay}</a><a href={instagramUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-2 text-sm text-muted hover:text-accent"><Instagram size={14} />@1joker_barber</a></div>
          <div><p className="font-mono text-[10px] text-muted">{t.visit}</p><p className="mt-2 text-sm text-frost">{t.address}</p><p className="mt-5 text-xs text-muted">© {new Date().getFullYear()} Joker Barber. {t.rights}</p></div>
        </div>
      </footer>
      {preview && (
        <div role="dialog" aria-modal="true" aria-label={preview.title} className="fixed inset-0 z-[70] grid place-items-center bg-ink/90 p-4 backdrop-blur-sm" onClick={() => setPreview(null)}>
          <div className="w-full max-w-xl overflow-hidden rounded-lg border border-line bg-panel" onClick={(event) => event.stopPropagation()}>
            <div className="relative aspect-[4/3] bg-ink"><MediaView media={preview.media} className="size-full object-cover" /><button type="button" onClick={() => setPreview(null)} aria-label={t.close} className="absolute right-3 top-3 grid size-10 place-items-center rounded-md bg-ink/80 text-frost backdrop-blur"><X size={19} /></button></div>
            <div className="flex flex-wrap items-center justify-between gap-4 p-5"><div><h3 className="text-xl font-bold text-frost">{preview.title}</h3>{preview.price && <p className="mt-1 font-display text-2xl text-accent">{preview.price}</p>}</div>{preview.serviceIndex != null && <a href="#book" onClick={() => { setServiceIndex(String(preview.serviceIndex)); setPreview(null); }} className="rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-foreground">{t.reserveThis}</a>}</div>
          </div>
        </div>
      )}
    </div>
  );
}