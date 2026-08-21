import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Check, ShoppingBag, Clock } from 'lucide-react';

export default function PlaceOrder() {
  const { addToCart, cart, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const storeStatus = { isOpen: false, message: "Store is Closed (Hours: 10 AM - 7 PM)" };

  const packages = [
    {
      id: 'small',
      name: 'SMALL PACKAGE',
      price: 50,
      description: 'Perfect single portion',
      items: ['2 Balls of Kenkey', 'Fried fish & Fried eggs', 'Sausages'],
      isPopular: false
    },
    {
      id: 'medium',
      name: 'MEDIUM PACK',
      price: 70,
      description: 'Our most popular balance',
      items: ['2 Balls of Kenkey', 'Fish / Shrimp', 'Cow leg (Kotodwe) stew'],
      isPopular: true
    },
    {
      id: 'dede',
      name: 'DEDE PACKAGE',
      price: 90,
      description: 'Extra indulgence',
      items: ['2 Balls of Kenkey', 'Fish, Eggs, Sardine', 'Gizzard sauce & Shrimp'],
      isPopular: false
    },
    {
      id: 'queen',
      name: "QUEEN'S PACKAGE",
      price: 140,
      description: 'Royal sharing portion',
      items: ['4 Balls of Kenkey', 'Fish, Eggs, Sardine', 'Gizzard sauce & Shrimp'],
      isPopular: false
    },
    {
      id: 'family',
      name: 'FAMILY PACK',
      price: 160,
      description: 'Designed for the household',
      items: ['6 Balls of Kenkey', 'Fish, Eggs, Sardine', 'Gizzard sauce & Shrimp'],
      isPopular: false
    }
  ];

  const handleAdd = (pkg) => {
    addToCart({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      quantity: 1,
      image: '/showcase.jpg'
    });
  };

  return (
    <div className="min-h-screen text-primary px-6 pt-28 pb-32 max-w-6xl mx-auto font-sans relative z-0">
      
      {/* --- AMBIENT BACKGROUND DEPTH --- */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#fdfcfb]">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-400/10 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-400/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-amber-400/15 blur-[150px]"></div>
      </div>

      {/* --- HERO IMAGE BANNER --- */}
      <div className="relative w-full h-[360px] md:h-[440px] rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 flex flex-col items-center justify-center text-center px-6">
        <img 
          src="/hero.jpg" 
          alt="Philos Kenkey Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-white font-normal drop-shadow-md">
            Place Your Order
          </h1>
          <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-5 py-2 rounded-full shadow-xl">
            <Clock size={16} className={storeStatus.isOpen ? 'text-green-600' : 'text-red-600'} />
            <span className="text-xs tracking-widest uppercase font-bold text-gray-900">{storeStatus.message}</span>
          </div>
        </div>
      </div>



      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {packages.slice(0, 3).map((pkg) => (
          <div 
            key={pkg.id}
            className={`rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative border transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
              pkg.isPopular 
                ? 'bg-[#111111] text-white border-neutral-800 shadow-xl' 
                : 'bg-white/90 backdrop-blur-xl border-white shadow-lg shadow-orange-950/5'
            }`}
          >
            {pkg.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-stone-950 text-[10px] tracking-widest uppercase font-extrabold px-4 py-1 rounded-full shadow-md">
                Popular
              </span>
            )}
            <div>
              <span className={`font-semibold text-xs tracking-widest uppercase block mb-2 ${pkg.isPopular ? 'text-orange-500' : 'text-orange-600'}`}>
                {pkg.name}
              </span>
              <div className="font-serif text-4xl font-normal mb-2">GHC {pkg.price}</div>
              <p className={`text-xs mb-8 ${pkg.isPopular ? 'text-neutral-400' : 'text-primary/70'}`}>{pkg.description}</p>
              
              <ul className="space-y-4 mb-10">
                {pkg.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check size={16} className={pkg.isPopular ? 'text-orange-500' : 'text-orange-600'} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => handleAdd(pkg)}
              className={`w-full py-3.5 rounded-full font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                pkg.isPopular ? 'bg-white text-stone-950 hover:bg-white/90' : 'bg-[#111111] text-white hover:bg-neutral-800'
              }`}
            >
              <span>Add to Order</span>
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {packages.slice(3).map((pkg) => (
          <div 
            key={pkg.id}
            className="rounded-3xl p-8 bg-white/90 backdrop-blur-xl border border-white shadow-lg shadow-orange-950/5 flex flex-col justify-between relative transition-all duration-500 hover:-translate-y-2 cursor-pointer"
          >
            <div>
              <span className="text-orange-600 font-semibold text-xs tracking-widest uppercase block mb-2">{pkg.name}</span>
              <div className="font-serif text-4xl font-normal mb-2">GHC {pkg.price}</div>
              <p className="text-primary/70 text-xs mb-8">{pkg.description}</p>
              
              <ul className="space-y-4 mb-10">
                {pkg.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check size={16} className="text-orange-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => handleAdd(pkg)}
              className="w-full bg-[#111111] text-white py-3.5 rounded-full font-medium text-sm hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Add to Order</span>
            </button>
          </div>
        ))}
      </div>


      {/* --- ADD-ONS SECTION --- */}
      <div className="mt-16 mb-16 max-w-4xl mx-auto">
        {(() => {
          const [isOpen, setIsOpen] = useState(false);
          const addons = [
            { id: 'addon-shrimp', name: 'Extra Shrimp / Monko', price: 30 },
            { id: 'addon-cowleg', name: 'Extra Cow Leg Stew', price: 25 },
            { id: 'addon-gizzard', name: 'Extra Gizzard Sauce', price: 25 },
            { id: 'addon-fish', name: 'Extra Fish', price: 20 },
            { id: 'addon-sausage', name: 'Extra Sausage', price: 15 },
            { id: 'addon-egg', name: 'Extra Egg (1)', price: 10 },
            { id: 'addon-sardine', name: 'Extra Sardine', price: 15 }
          ];

          return (
            <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl shadow-xl shadow-orange-950/5 overflow-hidden transition-all">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-8 py-6 flex items-center justify-between text-left cursor-pointer hover:bg-stone-50/50 transition-all"
              >
                <span className="font-serif text-2xl font-normal text-stone-900">Add-ons</span>
                <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center shadow-md transition-transform duration-300">
                  <span className={`text-xl font-light transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
                </div>
              </button>

              {isOpen && (
                <div className="px-8 pb-8 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-100 animate-fadeIn">
                  {addons.map((addon) => (
                    <div 
                      key={addon.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/60 hover:border-orange-500/50 transition-all"
                    >
                      <div>
                        <h3 className="font-medium text-sm text-stone-900">{addon.name}</h3>
                        <span className="text-xs text-orange-600 font-semibold">GHC {addon.price}</span>
                      </div>
                      <button 
                        onClick={() => addToCart({ id: addon.id, name: addon.name, price: addon.price, quantity: 1, image: '/showcase.jpg' })}
                        className="w-9 h-9 rounded-full bg-[#111111] text-white flex items-center justify-center hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
                        title="Add to order"
                      >
                        <span className="text-base font-light">+</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </div>


      {/* --- FLOATING BOUNCING CHECKOUT BAR --- */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center items-center pointer-events-none">
          <div className="animate-bounce pointer-events-auto">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-[#111111] text-white px-10 py-4 rounded-full shadow-2xl font-medium text-sm flex items-center gap-3 border border-white/20 hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <ShoppingBag size={18} className="text-orange-500" />
              <span>Proceed to Checkout ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

