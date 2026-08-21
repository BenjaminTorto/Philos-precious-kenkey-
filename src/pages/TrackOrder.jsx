import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Loader2, Printer, Clock, ChefHat, Bike, CheckCircle2 } from 'lucide-react';
import { supabase } from '../config/supabase';

export default function TrackOrder() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialShortId = location.state?.shortOrderId || '';
  const [searchId, setSearchId] = useState(initialShortId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      // 1. Check local storage first (since we are testing without a live DB)
      const localOrders = JSON.parse(localStorage.getItem('philos_orders') || '[]');
      const foundLocal = localOrders.find(o => o.id.toLowerCase() === searchId.trim().toLowerCase());

      if (foundLocal) {
        setOrder(foundLocal);
      } else {
        // 2. Fallback to Supabase if not found locally
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .ilike('id', `${searchId.trim()}%`)
          .limit(1);
          
        if (error) throw error;
        setOrder(data && data.length > 0 ? data[0] : null);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to determine step progress & ETA based on status
  const getStatusDetails = (status) => {
    switch (status) {
      case 'Preparing':
        return { step: 2, eta: 'Approx. 20 - 30 mins', desc: 'Your kenkey is being packed with fresh fish and hot sauce.' };
      case 'Out for Delivery':
        return { step: 3, eta: 'On the way to you!', desc: 'Your order has been dispatched and is arriving shortly.' };
      case 'Completed':
        return { step: 4, eta: 'Delivered', desc: 'Enjoy your meal from Philos Precious Kenkey!' };
      default:
        return { step: 1, eta: 'Awaiting confirmation', desc: 'Order received and waiting for kitchen review.' };
    }
  };

  return (
    <div className="min-h-screen relative z-0 font-sans pb-32">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#fdfcfb]">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-400/10 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-400/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-amber-400/15 blur-[150px]"></div>
      </div>

      <div className="relative z-10 text-primary px-6 pt-28 max-w-xl mx-auto">
        <div className="text-center mb-10 print:hidden">
          <h1 className="font-serif text-4xl tracking-tight mb-3">Track Your Order</h1>
          <p className="text-xs tracking-[0.2em] uppercase text-accent">Enter your Order ID to check live ETA & kitchen status</p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-12 print:hidden">
          <input 
            type="text"
            placeholder="Enter Order ID (e.g., A1B2C3D4)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 bg-surface border border-primary/10 rounded-2xl px-5 py-4 text-sm text-primary placeholder-primary/40 focus:outline-none focus:border-primary/40 shadow-sm uppercase font-mono"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-primary text-background px-6 rounded-2xl font-medium hover:bg-primary/90 transition-all shadow-md flex items-center justify-center cursor-pointer"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          </button>
        </form>

        {/* Results Section */}
        {searched && !loading && (
          <div className="space-y-6">
            {order ? (() => {
              const statusInfo = getStatusDetails(order.status);
              return (
                <div className="bg-surface rounded-3xl p-8 border border-primary/10 shadow-xl space-y-6 print:shadow-none print:border-none print:p-0">
                  
                  <div className="flex justify-between items-start border-b border-primary/10 pb-6">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-1">PHILOS PRECIOUS KENKEY</p>
                      <p className="font-mono text-2xl font-bold">#{order.id.toUpperCase()}</p>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-primary text-background text-xs font-bold uppercase tracking-wider print:border print:border-primary">
                      {order.status || 'Pending'}
                    </div>
                  </div>

                  {/* Live ETA & Kitchen Progress Widget */}
                  <div className="bg-background rounded-2xl p-6 border border-primary/10 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-accent">
                        <Clock size={16} />
                        <span className="text-xs uppercase tracking-wider font-bold">Live Kitchen ETA</span>
                      </div>
                      <span className="font-serif font-bold text-lg text-primary">{statusInfo.eta}</span>
                    </div>

                    <p className="text-xs text-primary/70">{statusInfo.desc}</p>

                    {/* Visual Progress Steps */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className={`h-2 rounded-full transition-all ${statusInfo.step >= 2 ? 'bg-primary' : 'bg-primary/10'}`} />
                      <div className={`h-2 rounded-full transition-all ${statusInfo.step >= 3 ? 'bg-primary' : 'bg-primary/10'}`} />
                      <div className={`h-2 rounded-full transition-all ${statusInfo.step >= 4 ? 'bg-primary' : 'bg-primary/10'}`} />
                    </div>
                  </div>

                  {/* Customer & Fulfillment Info */}
                  <div className="space-y-2 text-sm text-primary/85">
                    <p><strong className="text-primary">Customer:</strong> {order.customer_name || order.name}</p>
                    <p><strong className="text-primary">Phone:</strong> {order.customer_phone || order.phone}</p>
                    {order.address && <p><strong className="text-primary">Address:</strong> {order.address}</p>}
                    {order.dietary_notes && <p><strong className="text-primary">Notes:</strong> {order.dietary_notes}</p>}
                  </div>

                  {/* Items List */}
                  <div className="border-t border-primary/10 pt-6 space-y-3">
                    <p className="text-xs uppercase tracking-widest text-accent font-semibold">Items Ordered</p>
                    <div className="space-y-2 text-sm text-primary/80">
                      {(order.cart_items || order.items)?.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.quantity || 1}x {item.name} ({item.size})</span>
                          <span>GHC {item.price * (item.quantity || 1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Breakdown */}
                  <div className="border-t border-primary/10 pt-6 flex justify-between items-center text-lg font-serif font-bold">
                    <span>Total Amount</span>
                    <span className="text-2xl">GHC {order.total}</span>
                  </div>

                  {/* Print Receipt Button */}
                  <div className="pt-4 print:hidden flex gap-3">
                    <button 
                      onClick={handlePrint}
                      className="flex-1 py-3.5 rounded-full bg-surface border border-primary/20 text-primary font-medium hover:bg-primary/5 transition-all flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer"
                    >
                      <Printer size={16} />
                      <span>Print Receipt</span>
                    </button>
                  </div>

                </div>
              );
            })() : (
              <div className="text-center py-16 bg-surface rounded-3xl border border-primary/10 print:hidden">
                <p className="font-serif text-xl mb-2">Order Not Found</p>
                <p className="text-xs text-primary/60">Please double-check your Order ID and try again.</p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-10 print:hidden">
          <button 
            onClick={() => navigate('/')}
            className="text-xs uppercase tracking-widest text-accent hover:text-primary transition-colors font-medium cursor-pointer"
          >
            ← Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
