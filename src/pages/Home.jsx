import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Sparkles, Shield } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative z-0 pb-20">
      
      {/* --- EXACT AMBIENT BACKGROUND FROM PLACE ORDER --- */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#fdfcfb]">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-400/10 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-400/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-amber-400/15 blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-12 space-y-32">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center space-y-6 pt-12">
          <span className="text-xs uppercase tracking-widest px-4 py-1.5 text-orange-600 bg-orange-50 rounded-full border border-orange-200/60 shadow-sm font-bold">
            Authentic Ghanaian Delicacy
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-normal text-stone-900 tracking-tight">
            The Ultimate Kenkey<br />Experience
          </h1>
          <p className="max-w-xl mx-auto text-stone-600 text-lg">
            Freshly prepared kenkey served with perfectly fried fish, rich gizzard sauces, tender kotodwe stew, and custom packages designed to satisfy your cravings.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <button 
              onClick={() => navigate('/place-order')}
              className="px-8 py-4 rounded-full bg-[#111111] text-white font-bold hover:bg-neutral-800 transition-all shadow-xl shadow-orange-950/10 text-sm uppercase tracking-wider cursor-pointer"
            >
              Place an Order Now &rarr;
            </button>
            <button 
              onClick={() => navigate('/my-orders')}
              className="px-8 py-4 rounded-full bg-white/60 backdrop-blur-xl border border-stone-200 font-bold hover:bg-white hover:border-orange-200 transition-all text-sm uppercase tracking-wider cursor-pointer text-stone-800 shadow-sm"
            >
              View Past Orders
            </button>
          </div>
        </div>

        {/* --- FEATURES SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 shadow-xl shadow-orange-950/5 space-y-3 transition-all duration-500 hover:-translate-y-2 cursor-default">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-50 mb-4 text-orange-500">
              <Flame size={18} />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">Fresh Daily</h3>
            <p className="text-stone-600 text-sm leading-relaxed">Prepared fresh from Monday to Saturday, ensuring unbeatable taste and quality in every single ball.</p>
          </div>
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 shadow-xl shadow-orange-950/5 space-y-3 transition-all duration-500 hover:-translate-y-2 cursor-default">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-50 mb-4 text-orange-500">
              <Sparkles size={18} />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">Rich Local Sauces</h3>
            <p className="text-stone-600 text-sm leading-relaxed">From our signature gizzard sauce and shrimp monko to kotodwe stew, crafted with authentic spices.</p>
          </div>
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 shadow-xl shadow-orange-950/5 space-y-3 transition-all duration-500 hover:-translate-y-2 cursor-default">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-50 mb-4 text-orange-500">
              <Shield size={18} />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">Seamless Ordering</h3>
            <p className="text-stone-600 text-sm leading-relaxed">Track your delivery in real time with live kitchen ETAs and quick 1 click reordering.</p>
          </div>
        </div>

        {/* --- FULL DIMENSION EDGE-TO-EDGE IMAGE BANNER --- */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-950/15 group">
            <img 
              src="/BTB-5023.jpg" 
              alt="Philos Precious Kenkey Spread" 
              className="w-full h-auto object-contain rounded-[2.5rem] transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </div>
        </div>

        {/* --- PACKAGES SECTION --- */}
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-orange-600 font-bold">Our Packages</span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-stone-900">Curated For Your Appetite</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
            <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 shadow-xl shadow-orange-950/5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-orange-600 font-bold mb-2 block">Small Package</span>
                <div className="font-serif text-4xl mb-4 text-stone-900">GHC 50</div>
                <p className="text-stone-600 text-sm mb-8">2 Balls of Kenkey, fried fish, fried eggs, and savory sausages.</p>
              </div>
              <button onClick={() => navigate('/place-order')} className="text-orange-600 text-xs font-bold uppercase tracking-wider hover:text-orange-700 transition-colors flex items-center gap-2 cursor-pointer">
                Order Small Pack &rarr;
              </button>
            </div>

            <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-8 shadow-2xl flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 scale-105 z-10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2 block">Medium Pack (Popular)</span>
                <div className="font-serif text-4xl mb-4 text-white">GHC 70</div>
                <p className="text-neutral-400 text-sm mb-8">2 Balls of Kenkey, fish/shrimp, and our famous cow leg (Kotodwe) stew.</p>
              </div>
              <button onClick={() => navigate('/place-order')} className="text-white text-xs font-bold uppercase tracking-wider hover:text-neutral-300 transition-colors flex items-center gap-2 cursor-pointer">
                Order Medium Pack &rarr;
              </button>
            </div>

            <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 shadow-xl shadow-orange-950/5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-orange-600 font-bold mb-2 block">Dede Package</span>
                <div className="font-serif text-4xl mb-4 text-stone-900">GHC 90</div>
                <p className="text-stone-600 text-sm mb-8">2 Balls of Kenkey, fish, eggs, sardine, gizzard sauce & shrimp.</p>
              </div>
              <button onClick={() => navigate('/place-order')} className="text-orange-600 text-xs font-bold uppercase tracking-wider hover:text-orange-700 transition-colors flex items-center gap-2 cursor-pointer">
                Order Dede Pack &rarr;
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/place-order')}
            className="px-8 py-4 rounded-full bg-[#111111] text-white font-medium hover:bg-neutral-800 transition-all shadow-lg text-sm cursor-pointer inline-block"
          >
            View Full Menu & Add-ons
          </button>
        </div>

        {/* --- TESTIMONIALS SECTION --- */}
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-orange-600 font-bold">Customer Love</span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-stone-900">What Our Food Lovers Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
            <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 shadow-xl shadow-orange-950/5 relative">
              <div className="text-orange-500 mb-4 tracking-widest text-lg">★★★★★</div>
              <p className="text-stone-600 text-sm italic mb-8 leading-relaxed">"The gizzard sauce is out of this world! Perfectly spiced and the kenkey was super fresh. My new go-to spot."</p>
              <div>
                <h4 className="font-serif font-bold text-stone-900">Kofi Mensah</h4>
                <span className="text-[10px] uppercase tracking-widest text-orange-600">East Legon</span>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 shadow-xl shadow-orange-950/5 relative">
              <div className="text-orange-500 mb-4 tracking-widest text-lg">★★★★★</div>
              <p className="text-stone-600 text-sm italic mb-8 leading-relaxed">"Fast delivery and the packaging is so clean and premium. The Medium Pack is my absolute favorite."</p>
              <div>
                <h4 className="font-serif font-bold text-stone-900">Abena Serwaa</h4>
                <span className="text-[10px] uppercase tracking-widest text-orange-600">Osu</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 shadow-xl shadow-orange-950/5 relative">
              <div className="text-orange-500 mb-4 tracking-widest text-lg">★★★★★</div>
              <p className="text-stone-600 text-sm italic mb-8 leading-relaxed">"You can tell everything is freshly prepared. That cow leg stew (Kotodwe) is tender and delicious!"</p>
              <div>
                <h4 className="font-serif font-bold text-stone-900">Yaw Boateng</h4>
                <span className="text-[10px] uppercase tracking-widest text-orange-600">Airport Residential</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
