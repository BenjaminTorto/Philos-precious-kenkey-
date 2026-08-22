import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const computedSubtotal = cart.reduce((sum, item) => sum + (Number(item?.price || 0) * (item?.quantity || 1)), 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex w-full md:w-auto md:pl-10">
        <div className="w-full md:w-screen md:max-w-md bg-background text-primary shadow-2xl flex flex-col justify-between border-l border-primary/10">
          
          <div className="p-4 md:p-6 border-b border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} />
              <h2 className="font-serif text-xl md:text-2xl">Your Order</h2>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-surface transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-accent font-sans">
                <p>Your cart is currently empty.</p>
                <p className="text-sm mt-2">Select a package or add-on to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={`${item.name}-${item.size}-${index}`} className="bg-surface rounded-2xl p-4 flex items-center justify-between border border-primary/5 shadow-sm">
                    <div>
                      <p className="font-serif text-sm md:text-base font-medium">{item.name}</p>
                      <p className="font-sans text-[10px] md:text-xs text-accent uppercase tracking-wider mt-0.5">Option: {item.size || 'STANDARD'}</p>
                      <p className="font-sans font-semibold mt-1 text-sm md:text-base">GHC {item.price}</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
                      <div className="flex items-center bg-background rounded-full border border-primary/10 px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(item.name, item.size, -1)}
                          className="p-1 hover:text-accent transition-colors cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 font-sans text-xs md:text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.name, item.size, 1)}
                          className="p-1 hover:text-accent transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.name, item.size)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 md:p-6 border-t border-primary/15 bg-surface/50 space-y-4 safe-area-bottom pb-8 md:pb-6">
              <div className="flex justify-between items-center text-base md:text-lg font-serif font-bold text-primary pb-2">
                <span>Subtotal</span>
                <span className="text-lg md:text-xl">GHC {computedSubtotal}</span>
              </div>

              <button 
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 md:py-4 rounded-full bg-primary text-background font-sans font-medium text-center hover:bg-primary/90 transition-all shadow-lg active:scale-[0.98] cursor-pointer"
              >
                Proceed to Checkout (GHC {computedSubtotal})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
