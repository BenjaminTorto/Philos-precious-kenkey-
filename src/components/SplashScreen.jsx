import React, { useState, useEffect, useRef } from 'react';

// The cinematic sequence: mix of real kitchen video and food photography.
// Durations are in milliseconds.
const SEGMENTS = [
  { type: 'video', src: '/splash/pot.mp4', duration: 4500 },
  { type: 'image', src: '/splash/gizzard.jpg', duration: 2800 },
  { type: 'image', src: '/splash/plate.jpg', duration: 2800 },
  { type: 'image', src: '/splash/spread.jpg', duration: 2800 },
  { type: 'video', src: '/splash/bag.mp4', duration: 3600 },
];

export default function SplashScreen({ onFinish }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const barRefs = useRef([]);
  const timeoutRef = useRef(null);

  const finish = () => {
    setExiting(true);
    // Let the fade-out transition play before actually unmounting
    setTimeout(() => onFinish?.(), 400);
  };

  useEffect(() => {
    // Animate the active progress bar from 0 -> 100% over this segment's duration
    const bar = barRefs.current[activeIndex];
    if (bar) {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      // Force reflow so the transition below actually animates from 0
      // eslint-disable-next-line no-unused-expressions
      bar.offsetHeight;
      bar.style.transition = `width ${SEGMENTS[activeIndex].duration}ms linear`;
      bar.style.width = '100%';
    }

    timeoutRef.current = setTimeout(() => {
      if (activeIndex < SEGMENTS.length - 1) {
        setActiveIndex((i) => i + 1);
      } else {
        finish();
      }
    }, SEGMENTS[activeIndex].duration);

    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black overflow-hidden transition-opacity duration-500 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* --- MEDIA LAYERS --- */}
      {SEGMENTS.map((seg, i) => (
        <div
          key={seg.src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {seg.type === 'video' ? (
            <video
              src={seg.src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={seg.src}
              alt=""
              className="w-full h-full object-contain"
            />
          )}
        </div>
      ))}

      {/* --- DARKENING GRADIENT FOR TEXT LEGIBILITY --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />

      {/* --- PROGRESS BARS (top) --- */}
      <div className="absolute top-0 left-0 right-0 flex gap-1.5 p-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        {SEGMENTS.map((seg, i) => (
          <div key={seg.src} className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
            <div
              ref={(el) => (barRefs.current[i] = el)}
              className="h-full bg-white rounded-full"
              style={{ width: i < activeIndex ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* --- SKIP BUTTON --- */}
      <button
        onClick={finish}
        className="absolute top-6 right-4 mt-[env(safe-area-inset-top)] z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-widest hover:bg-white/20 transition-all cursor-pointer"
      >
        Skip
      </button>

      {/* --- TEXT CONTENT --- */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6 pb-16 sm:pb-20">
        <span className="text-white/70 text-xs uppercase tracking-[0.3em] font-semibold mb-4">
          Philos Precious Kenkey
        </span>
        <h1 className="font-serif text-white text-4xl sm:text-6xl leading-tight mb-4">
          Real Kenkey.
          <br />
          <span className="italic font-light">Made With Love.</span>
        </h1>
        <p className="text-white/80 text-sm sm:text-base max-w-md mb-8">
          Hand-wrapped in corn husks, steamed slow, and served fresh — every single day.
        </p>
        <button
          onClick={finish}
          className="px-8 py-4 rounded-full bg-white text-stone-950 font-bold text-sm uppercase tracking-wider hover:bg-white/90 transition-all shadow-xl cursor-pointer"
        >
          Enter Site
        </button>
      </div>
    </div>
  );
}
