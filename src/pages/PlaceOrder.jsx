import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function PlaceOrder() {
  const { cart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item?.price || 0) * (item?.quantity || 1)), 0);

  return (
    <div className="min-h-screen bg-background text-primary pb-32">
      {/* Your existing PlaceOrder page content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl font-bold mb-6">Complete Your Order</h1>
        {/* Placeholder for packages grid / items */}
        <div className="text-stone-500 mb-12">Select your items and packages above to build your order.</div>
      </div>

      {/* Floating Mobile Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-t border-stone-200/80 p-4 shadow-2xl pb-6 md:pb-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total Amount</p>
                <p className="font-serif font-bold text-lg text-stone-900">GHC {cartTotal}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingBag size={16} />
                <span>View Cart</span>
              </button>

              <button
                onClick={() => navigate('/checkout')}
                className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <span>Checkout</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
