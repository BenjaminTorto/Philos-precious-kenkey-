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
  const timeoutRef = useRef(null);

  const finish = () => {
    setExiting(true);
    // Let the fade-out transition play before actually unmounting
    setTimeout(() => onFinish?.(), 400);
  };

  useEffect(() => {
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
          className={`absolute inset-0 transition-opacity duration-[1200ms] ${
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

      {/* --- SOFT DARKENING GRADIENT FOR TEXT LEGIBILITY --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />

      {/* --- QUIET LOGO, TOP LEFT --- */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <span className="text-white text-sm font-serif tracking-wide">
          Philos Precious Kenkey
        </span>

        {/* --- SKIP, MINIMAL TEXT LINK --- */}
        <button
          onClick={finish}
          className="text-white/70 text-xs uppercase tracking-widest font-medium hover:text-white transition-colors cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* --- TEXT CONTENT, VERTICALLY CENTERED --- */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-white text-4xl sm:text-6xl leading-[1.15] mb-5">
          Real Kenkey.
          <br />
          <span className="italic font-light">Made With Love.</span>
        </h1>
        <p className="text-white/75 text-sm sm:text-base max-w-md mb-10 font-sans">
          Hand-wrapped in corn husks, steamed slow, and served fresh — every single day.
        </p>
        <button
          onClick={finish}
          className="px-8 py-3.5 rounded-full bg-white text-stone-950 font-sans font-semibold text-sm hover:bg-white/90 transition-all shadow-xl cursor-pointer"
        >
          Enter Site
        </button>
      </div>
    </div>
  );
}
