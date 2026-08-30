import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react';
import { supabase } from '../config/supabase';

const REDEMPTION_POINTS = 100;
const REDEMPTION_VALUE = 10; // GHC discount for redeeming REDEMPTION_POINTS

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    deliveryType: 'delivery',
  });

  const [loyaltyPoints, setLoyaltyPoints] = useState(null); // null = not checked yet
  const [checkingPoints, setCheckingPoints] = useState(false);
  const [redeemApplied, setRedeemApplied] = useState(false);

  const checkLoyaltyPoints = async () => {
    const phone = formData.phone.trim();
    if (phone.length < 9) return;
    setCheckingPoints(true);
    try {
      const { data } = await supabase.from('loyalty_members').select('*').eq('phone', phone).single();
      setLoyaltyPoints(data ? data.points : 0);
    } catch (err) {
      setLoyaltyPoints(0);
    } finally {
      setCheckingPoints(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + ((Number(item?.price) || 0) * (item.quantity || 1)), 0);
  const deliveryFee = formData.deliveryType === 'delivery' ? 25 : 0;
  const canRedeem = loyaltyPoints !== null && loyaltyPoints >= REDEMPTION_POINTS;
  const loyaltyDiscount = redeemApplied && canRedeem ? REDEMPTION_VALUE : 0;
  const total = Math.max(0, subtotal + deliveryFee - loyaltyDiscount);

  const [isSuccess, setIsSuccess] = React.useState(false);
  const [orderCode, setOrderCode] = React.useState('');

  // Builds the record in the exact shape your Supabase "orders" table expects.
  // Note: "id" is a uuid Supabase generates automatically - we never set it
  // ourselves. The friendly code (e.g. "PH-1234") is stored in "short_id" and
  // is what customers use to track their order.
  const buildOrderRecord = (shortId) => ({
    short_id: shortId,
    customer_name: formData.name,
    customer_phone: formData.phone,
    fulfillment_type: formData.deliveryType,
    address: formData.deliveryType === 'delivery' ? formData.address : null,
    dietary_notes: formData.notes || null,
    cart_items: cart,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    loyalty_discount: loyaltyDiscount,
    status: 'Pending',
  });

  // Saves the order to Supabase (so it's searchable in My Orders / visible in
  // Admin), deducts any redeemed points, and awards 10 new points for this
  // order. Always also writes to localStorage as a fallback so Track Order
  // still works even if Supabase is unreachable.
  const saveOrder = async (shortId) => {
    const record = buildOrderRecord(shortId);
    const pointsRedeemed = loyaltyDiscount > 0 ? REDEMPTION_POINTS : 0;

    const existingOrders = JSON.parse(localStorage.getItem('philos_orders') || '[]');
    localStorage.setItem(
      'philos_orders',
      JSON.stringify([{ ...record, id: shortId, date: new Date().toLocaleDateString() }, ...existingOrders])
    );

    try {
      const { error: orderError } = await supabase.from('orders').insert([record]);
      if (orderError) throw orderError;

      // Update loyalty points: subtract anything redeemed, add 10 earned for this order
      const { data: existingMember } = await supabase
        .from('loyalty_members')
        .select('*')
        .eq('phone', formData.phone)
        .single();

      if (existingMember) {
        const newPoints = Math.max(0, (existingMember.points || 0) - pointsRedeemed) + 10;
        await supabase
          .from('loyalty_members')
          .update({ points: newPoints, customer_name: formData.name })
          .eq('phone', formData.phone);
      } else {
        await supabase
          .from('loyalty_members')
          .insert([{ phone: formData.phone, customer_name: formData.name, points: 10 }]);
      }
    } catch (err) {
      // Order still exists locally even if this fails, so we don't block checkout
      console.error('Could not save order to Supabase (order was still saved locally):', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      const shortId = 'PH-' + Math.floor(1000 + Math.random() * 9000);
      await saveOrder(shortId);

      setOrderCode(shortId);
      setIsSuccess(true);
      setTimeout(() => {
        clearCart();
        navigate('/track', { state: { shortOrderId: shortId } });
      }, 3000);
    } catch (err) {
      alert('Failed to place order. Please try again.');
    }
  };

  const handleWhatsAppOrder = async () => {
    if (!formData.name || !formData.phone) {
      alert('Please fill in your name and phone number to continue via WhatsApp.');
      return;
    }
    if (cart.length === 0) return;

    const shortId = 'PH-' + Math.floor(1000 + Math.random() * 9000);
    await saveOrder(shortId);

    // Build the WhatsApp message
    let msg = `*NEW ORDER (${shortId})* 🚀\n\n`;
    msg += `*Customer:* ${formData.name}\n`;
    msg += `*Phone:* ${formData.phone}\n`;
    if (formData.address) msg += `*Address:* ${formData.address}\n`;
    if (formData.notes) msg += `*Notes:* ${formData.notes}\n\n`;

    msg += `*ORDER DETAILS:*\n`;
    cart.forEach(item => {
      msg += `▪️ ${item.quantity || 1}x ${item.name} (${item.size || 'STANDARD'}) - GHC ${item.price * (item.quantity || 1)}\n`;
    });
    if (loyaltyDiscount > 0) {
      msg += `\n*VIP Discount Applied: -GHC ${loyaltyDiscount}*\n`;
    }
    msg += `\n*TOTAL: GHC ${total}*\n`;
    msg += `\nTrack this order on our website using ID: ${shortId}`;

    // Open WhatsApp in a new tab (Formatted for Ghana +233)
    const waNumber = '233207800925';
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    // Trigger the success modal & auto-redirect
    setOrderCode(shortId);
    setIsSuccess(true);
    setTimeout(() => {
      clearCart();
      navigate('/track', { state: { shortOrderId: shortId } });
    }, 6000);
  };

  return (
    <>
    {/* --- AMBIENT BACKGROUND ADDED HERE --- */}
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#fdfcfb]">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-400/10 blur-[120px]"></div>
      <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-400/5 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-amber-400/15 blur-[150px]"></div>
    </div>

    <div className="max-w-6xl mx-auto px-4 py-12 font-sans">
      <button 
        onClick={() => navigate('/place-order')}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/70 hover:text-primary mb-6"
      >
        <ArrowLeft size={16} /> Back to Menu
      </button>

      <h1 className="font-serif text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="bg-surface p-8 rounded-3xl border border-primary/10 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold">Delivery & Contact Details</h2>
            
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold mb-2">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Kofi Mensah"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 rounded-2xl bg-background border border-primary/10 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold mb-2">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="e.g. 024 123 4567"
                value={formData.phone}
                onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setLoyaltyPoints(null); setRedeemApplied(false); }}
                onBlur={checkLoyaltyPoints}
                className="w-full p-4 rounded-2xl bg-background border border-primary/10 focus:outline-none"
              />

              {checkingPoints && (
                <p className="text-xs text-primary/50 mt-2">Checking your VIP points...</p>
              )}

              {!checkingPoints && loyaltyPoints !== null && (
                <div className="mt-3 p-4 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-accent">
                      {loyaltyPoints} VIP {loyaltyPoints === 1 ? 'Point' : 'Points'}
                    </p>
                    <p className="text-[11px] text-primary/60 mt-0.5">
                      {canRedeem
                        ? `Redeem ${REDEMPTION_POINTS} points for GHC ${REDEMPTION_VALUE} off`
                        : `Earn ${REDEMPTION_POINTS - loyaltyPoints} more point${REDEMPTION_POINTS - loyaltyPoints === 1 ? '' : 's'} to unlock a discount`}
                    </p>
                  </div>
                  {canRedeem && (
                    <button
                      type="button"
                      onClick={() => setRedeemApplied(!redeemApplied)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                        redeemApplied ? 'bg-accent text-white' : 'bg-white border border-accent/30 text-accent'
                      }`}
                    >
                      {redeemApplied ? 'Applied ✓' : 'Redeem'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold mb-2">Fulfillment Option</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryType: 'delivery' })}
                  className={`py-4 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    formData.deliveryType === 'delivery' ? 'bg-primary text-background border-primary' : 'bg-background text-primary border-primary/10'
                  }`}
                >
                  Delivery (GHC 25)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryType: 'pickup' })}
                  className={`py-4 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    formData.deliveryType === 'pickup' ? 'bg-primary text-background border-primary' : 'bg-background text-primary border-primary/10'
                  }`}
                >
                  Pickup
                </button>
              </div>
            </div>

            {formData.deliveryType === 'delivery' && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2">Delivery Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. East Legon, Near American House"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-background border border-primary/10 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold mb-2">Order Notes (Optional)</label>
              <textarea
                placeholder="e.g. Extra pepper please"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-4 rounded-2xl bg-background border border-primary/10 focus:outline-none h-24 resize-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={cart.length === 0}
              className="w-full py-4 rounded-full bg-primary text-background font-bold hover:bg-primary/90 transition-all uppercase tracking-wider text-xs shadow-lg disabled:opacity-50 cursor-pointer"
            >
              Place Order on Website (GHC {total})
            </button>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              disabled={cart.length === 0}
              className="w-full py-4 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all uppercase tracking-wider text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <MessageCircle size={18} /> Order via WhatsApp (GHC {total})
            </button>
          </div>
        </form>

        <div className="lg:col-span-5">
          <div className="bg-surface p-8 rounded-3xl border border-primary/10 shadow-sm space-y-6 sticky top-6">
            <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
              <ShoppingBag size={22} className="text-accent" /> Order Summary
            </h2>

            <div className="divide-y divide-primary/10 max-h-60 overflow-y-auto space-y-3">
              {cart.map((item, index) => (
                <div key={item.cartId || index} className="pt-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-serif font-medium">{item.name}</p>
                    <span className="text-xs text-accent uppercase">OPTION: {item.size || 'STANDARD'}</span>
                  </div>
                  <span className="font-bold">GHC {item.price}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-primary/10 space-y-2 text-sm">
              <div className="flex justify-between text-primary/70">
                <span>Subtotal</span>
                <span>GHC {subtotal}</span>
              </div>
              <div className="flex justify-between text-primary/70">
                <span>{formData.deliveryType === 'delivery' ? 'Delivery Fee' : 'Pickup'}</span>
                <span>GHC {deliveryFee}</span>
              </div>
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-accent font-medium">
                  <span>VIP Discount</span>
                  <span>- GHC {loyaltyDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-primary/10">
                <span className="font-serif">Total</span>
                <span className="font-serif">GHC {total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm px-4">
          <div className="bg-background p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full animate-bounce">
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg">✓</div>
            <h2 className="font-serif text-3xl mb-3 text-primary">Thank You!</h2>
            <p className="text-secondary font-medium">Your order has been placed successfully.</p>
          </div>
        </div>
      )}
  
    </>
  );
}
