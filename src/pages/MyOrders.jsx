import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, RotateCcw, Crown, Star, CheckCircle } from 'lucide-react';
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

  // Reviews already left, keyed by order short_id
  const [reviewedIds, setReviewedIds] = useState({});
  // Which order's review form is currently open
  const [openReviewId, setOpenReviewId] = useState(null);
  const [ratingDraft, setRatingDraft] = useState(0);
  const [commentDraft, setCommentDraft] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

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

      // Check which of these orders already have a review
      const shortIds = (orderData || []).map(o => o.short_id).filter(Boolean);
      if (shortIds.length > 0) {
        const { data: reviewData } = await supabase.from('reviews').select('order_short_id').in('order_short_id', shortIds);
        const reviewedMap = {};
        (reviewData || []).forEach(r => { reviewedMap[r.order_short_id] = true; });
        setReviewedIds(reviewedMap);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (order) => {
    if (ratingDraft === 0) {
      alert('Please select a star rating.');
      return;
    }
    setSubmittingReview(true);
    try {
      const { error } = await supabase.from('reviews').insert([{
        order_short_id: order.short_id,
        customer_name: order.customer_name,
        rating: ratingDraft,
        comment: commentDraft.trim() || null,
        approved: false,
      }]);
      if (error) throw error;

      setReviewedIds(prev => ({ ...prev, [order.short_id]: true }));
      setOpenReviewId(null);
      setRatingDraft(0);
      setCommentDraft('');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Could not submit your review. Please try again.');
    } finally {
      setSubmittingReview(false);
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

                    {/* --- REVIEW SECTION (only for completed orders) --- */}
                    {order.status === 'Completed' && order.short_id && (
                      <div className="mt-4 pt-4 border-t border-primary/10">
                        {reviewedIds[order.short_id] ? (
                          <div className="flex items-center gap-2 text-xs text-green-600 font-bold uppercase tracking-wider">
                            <CheckCircle size={14} /> Thanks for your review!
                          </div>
                        ) : openReviewId === order.short_id ? (
                          <div className="space-y-3">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <button key={n} onClick={() => setRatingDraft(n)} className="cursor-pointer">
                                  <Star
                                    size={22}
                                    className={n <= ratingDraft ? 'text-accent' : 'text-primary/20'}
                                    fill={n <= ratingDraft ? 'currentColor' : 'none'}
                                  />
                                </button>
                              ))}
                            </div>
                            <textarea
                              rows="2"
                              placeholder="Tell us how it was (optional)"
                              value={commentDraft}
                              onChange={(e) => setCommentDraft(e.target.value)}
                              className="w-full bg-background border border-primary/10 rounded-2xl p-3 text-sm resize-none focus:outline-none focus:border-primary transition-all"
                            ></textarea>
                            <div className="flex gap-2">
                              <button
                                onClick={() => submitReview(order)}
                                disabled={submittingReview}
                                className="bg-primary text-background px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
                              >
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                              </button>
                              <button
                                onClick={() => { setOpenReviewId(null); setRatingDraft(0); setCommentDraft(''); }}
                                className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-primary/50 hover:text-primary cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setOpenReviewId(order.short_id)}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent hover:text-accent/80 cursor-pointer"
                          >
                            <Star size={14} /> Leave a Review
                          </button>
                        )}
                      </div>
                    )}
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
