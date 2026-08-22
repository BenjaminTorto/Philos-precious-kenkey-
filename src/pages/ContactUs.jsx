import React from 'react';
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react';

// Simple inline brand icons (lucide-react doesn't ship Instagram/TikTok glyphs)
function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 5.82c-.87-.83-1.4-1.99-1.4-3.27h-3.1v13.4c0 1.53-1.24 2.77-2.77 2.77a2.77 2.77 0 0 1-2.77-2.77 2.77 2.77 0 0 1 2.77-2.77c.28 0 .55.04.8.12v-3.15a5.88 5.88 0 0 0-.8-.06A5.88 5.88 0 0 0 3.47 15.9a5.88 5.88 0 0 0 5.86 5.86 5.88 5.88 0 0 0 5.87-5.86V9.28a8.5 8.5 0 0 0 4.97 1.6V7.78a5.6 5.6 0 0 1-3.57-1.96z" />
    </svg>
  );
}

// Phone numbers formatted for tel: and WhatsApp (Ghana country code 233)
const PHONE_NUMBERS = [
  { display: '020 780 0925', tel: '+233207800925', wa: '233207800925' },
  { display: '026 701 8306', tel: '+233267018306', wa: '233267018306' },
];

export default function ContactUs() {
  return (
    <div className="min-h-screen relative z-0 pb-24">

      {/* --- AMBIENT BACKGROUND (matches rest of site) --- */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#fdfcfb]">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-400/10 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-400/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-amber-400/15 blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-12 font-sans text-primary">

        {/* --- HEADER --- */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs uppercase tracking-widest px-4 py-1.5 text-orange-600 bg-orange-50 rounded-full border border-orange-200/60 shadow-sm font-bold inline-block">
            We'd Love To Hear From You
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-stone-900 tracking-tight">
            Contact Us
          </h1>
          <p className="max-w-xl mx-auto text-stone-600 text-sm md:text-base">
            Reach out for orders, questions, or event bookings — we're happy to help.
          </p>
        </div>

        {/* --- CALL / WHATSAPP CARD --- */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-orange-950/5 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 text-orange-500 shrink-0">
              <Phone size={18} />
            </div>
            <h2 className="font-serif text-xl md:text-2xl text-stone-900">Call or WhatsApp</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PHONE_NUMBERS.map((num) => (
              <div
                key={num.tel}
                className="bg-background rounded-2xl p-5 border border-primary/10 flex flex-col gap-3"
              >
                <span className="font-serif text-lg font-medium text-stone-900">{num.display}</span>
                <div className="flex gap-2">
                  <a
                    href={`tel:${num.tel}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all cursor-pointer"
                  >
                    <Phone size={14} /> Call
                  </a>
                  <a
                    href={`https://wa.me/${num.wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-green-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-green-700 transition-all cursor-pointer"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- LOCATION + HOURS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-orange-950/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 text-orange-500 shrink-0">
                <MapPin size={18} />
              </div>
              <h2 className="font-serif text-xl text-stone-900">Our Location</h2>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              Abelenkpe, Bryan Street 15
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Abelenkpe+Bryan+Street+15"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider hover:text-orange-700 transition-colors cursor-pointer"
            >
              Get Directions &rarr;
            </a>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-orange-950/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 text-orange-500 shrink-0">
                <Clock size={18} />
              </div>
              <h2 className="font-serif text-xl text-stone-900">Opening Hours</h2>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed">
              Monday &ndash; Saturday<br />
              10:00 AM &ndash; 7:00 PM
            </p>
          </div>
        </div>

        {/* --- SOCIAL MEDIA --- */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-orange-950/5">
          <h2 className="font-serif text-xl md:text-2xl text-stone-900 mb-6">Follow Us</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://www.tiktok.com/@philoskenkey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-background rounded-2xl p-5 border border-primary/10 hover:border-orange-500/50 transition-all cursor-pointer"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#111111] text-white shrink-0">
                <TikTokIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-medium text-stone-900">TikTok</p>
                <p className="text-xs text-stone-500">Philo's Kenkey</p>
              </div>
            </a>

            <a
              href="https://www.instagram.com/philoskenkeyhub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-background rounded-2xl p-5 border border-primary/10 hover:border-orange-500/50 transition-all cursor-pointer"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white shrink-0">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-medium text-stone-900">Instagram</p>
                <p className="text-xs text-stone-500">Philo's Kenkey Hub</p>
              </div>
            </a>
          </div>

          <p className="text-[11px] text-stone-400 mt-4">
            Note: double-check these social links point to your real profiles — update the URLs in ContactUs.jsx if your @handles differ.
          </p>
        </div>

      </div>
    </div>
  );
}
