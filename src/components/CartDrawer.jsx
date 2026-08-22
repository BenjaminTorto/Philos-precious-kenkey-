import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + ((Number(item?.price) || 0) * (item?.quantity || 1)), 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-accent" />
              <h2 className="font-serif text-2xl">Your Order</h2>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={item.cartId || index} className="bg-background rounded-2xl p-4 border border-primary/10 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-serif font-medium text-lg">{item.name}</p>
                    <p className="text-xs text-accent uppercase tracking-wider">OPTION: {item.size || 'STANDARD'}</p>
                    <p className="text-sm font-bold mt-1 text-primary">GHC {Number(item.price || 0) * (item.quantity || 1)} {item.quantity > 1 ? `(Qty: ${item.quantity})` : ''}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.cartId !== undefined ? item.cartId : index)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-primary/60">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-40" />
                <p className="font-serif text-xl mb-1">Your cart is empty</p>
                <p className="text-xs uppercase tracking-widest text-accent">Add some delicious items to begin</p>
              </div>
            )}
          </div>

          {/* Footer / Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-primary/10 bg-background space-y-4">
              <div className="flex justify-between items-center text-lg font-medium">
                <span className="text-primary/70">Subtotal</span>
                <span className="font-serif font-bold text-2xl text-primary" style={{ color: '#171717' }}>GHC {subtotal}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full py-4 rounded-full bg-primary text-background font-bold hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center uppercase tracking-wider text-xs cursor-pointer"
              >
                Proceed to Checkout (GHC {subtotal})
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
