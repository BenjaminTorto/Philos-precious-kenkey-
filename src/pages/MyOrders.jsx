import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, RotateCcw, Crown } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useCart } from '../context/CartContext';

export default function MyOrders() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const { data: orderData } = await supabase.from('orders').select('*').eq('customer_phone', phone.trim()).order('created_at', { ascending: false });
      const { data: loyaltyData } = await supabase.from('loyalty_members').select('*').eq('phone', phone.trim()).single();
      
      setOrders(orderData || []);
      setLoyalty(loyaltyData || null);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (cartItems) => {
    cartItems.forEach(item => addToCart({ name: item.name, size: item.size, price: item.price }));
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen relative z-0 font-sans pb-32">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#fdfcfb]">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-400/10 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-400/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-amber-400/15 blur-[150px]"></div>
      </div>

      <div className="relative z-10 text-primary px-6 pt-28 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl tracking-tight mb-3">Order History & VIP</h1>
          <p className="text-xs tracking-[0.2em] uppercase text-accent">Enter phone number to view past orders</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-12">
          <input type="tel" placeholder="Enter phone number (e.g., 0244...)" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 bg-surface border border-primary/10 rounded-2xl px-5 py-4 text-sm shadow-sm font-mono" />
          <button type="submit" disabled={loading} className="bg-primary text-background px-6 rounded-2xl font-medium shadow-md flex items-center justify-center cursor-pointer">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          </button>
        </form>

        {searched && !loading && (
          <div className="space-y-8">
            
            {/* VIP Loyalty Card */}
            {loyalty && (
              <div className="bg-primary text-background rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-background/10"><Crown size={120} /></div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-background/60 mb-2">Precious VIP Club</p>
                <h2 className="font-serif text-3xl mb-1">{loyalty.customer_name}</h2>
                <div className="flex items-center gap-3 mt-6">
                  <span className="bg-accent text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{loyalty.points} Points</span>
                  <span className="text-sm text-background/80">Keep ordering to earn more!</span>
                </div>
              </div>
            )}

            {orders.length > 0 ? (
              orders.map((order) => {
                const shortId = (order.short_id || order.id).toUpperCase();
                return (
                  <div key={order.id} className="bg-surface rounded-3xl p-6 border border-primary/10 shadow-xl">
                    <div className="flex justify-between items-start border-b border-primary/10 pb-4 mb-4">
                      <div>
                        <div className="font-mono font-bold text-lg mb-1">#{shortId}</div>
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider">Status: {order.status}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-serif font-bold text-xl mb-1">GHC {order.total}</p>
                        {order.scheduled_time && order.scheduled_time !== 'ASAP (Right Now)' && (
                          <p className="text-xs text-accent uppercase font-bold tracking-wider">{order.scheduled_time}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button onClick={() => handleReorder(order.cart_items)} className="bg-primary text-background px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer">
                        <RotateCcw size={14} /> Reorder
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-surface rounded-3xl border border-primary/10">
                <p className="font-serif text-xl mb-2">No Past Orders Found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
