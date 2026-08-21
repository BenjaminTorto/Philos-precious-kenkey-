import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Utensils, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EventBooking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventType: 'Family Gathering',
    packageType: 'Family Pack (GHC 160)',
    quantity: '2',
    eventDate: '',
    eventTime: '13:00',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingBookings = JSON.parse(localStorage.getItem('philos_event_bookings') || '[]');
    const newBooking = {
      id: 'EVT-' + Date.now().toString().slice(-6),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'Pending Confirmation'
    };
    localStorage.setItem('philos_event_bookings', JSON.stringify([...existingBookings, newBooking]));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen relative z-0 pb-24">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#fdfcfb]">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-400/10 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-400/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-amber-400/15 blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 font-sans text-primary">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-700 border border-orange-500/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles size={14} /> Catering & Events
          </div>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Book For Your Special Event</h1>
          <p className="text-primary/70 max-w-xl mx-auto text-sm md:text-base">
            Planning a party, family weekend, or corporate lunch? Reserve your fresh Kenkey and fish packages in advance to guarantee availability.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-surface/80 backdrop-blur-xl border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">Your Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Akosua Mensah"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-primary/15 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">WhatsApp Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="e.g. 0207800925"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-background border border-primary/15 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">Event Type</label>
                <select 
                  value={formData.eventType}
                  onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                  className="w-full bg-background border border-primary/15 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-primary transition-all shadow-sm cursor-pointer"
                >
                  <option>Family Gathering</option>
                  <option>Birthday Party</option>
                  <option>Corporate Lunch</option>
                  <option>Wedding Reception</option>
                  <option>Other Celebration</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">Preferred Package</label>
                <select 
                  value={formData.packageType}
                  onChange={(e) => setFormData({...formData, packageType: e.target.value})}
                  className="w-full bg-background border border-primary/15 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-primary transition-all shadow-sm cursor-pointer"
                >
                  <option>Medium Pack (GHC 70)</option>
                  <option>Dede Package (GHC 90)</option>
                  <option>Queen’s Package (GHC 140)</option>
                  <option>Family Pack (GHC 160)</option>
                  <option>Custom Bulk Order</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">Number of Packs</label>
                <input 
                  type="number" 
                  min="1"
                  max="50"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full bg-background border border-primary/15 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-accent mb-2 flex items-center gap-2">
                  <CalendarIcon size={14} /> Event Date
                </label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.eventDate}
                  onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                  className="w-full bg-background border border-primary/15 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-accent mb-2 flex items-center gap-2">
                  <Clock size={14} /> Delivery / Pickup Time
                </label>
                <input 
                  type="time" 
                  required
                  value={formData.eventTime}
                  onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
                  className="w-full bg-background border border-primary/15 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-accent mb-2">Special Notes / Instructions</label>
              <textarea 
                rows="3"
                placeholder="Any specific delivery location, extra pepper preferences, or dietary requests..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-background border border-primary/15 rounded-2xl p-5 text-sm focus:outline-none focus:border-primary transition-all shadow-sm resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-background py-4 rounded-2xl font-medium tracking-wide hover:bg-primary/90 transition-all shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Confirm Event Reservation</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        ) : (
          <div className="bg-surface/80 backdrop-blur-xl border border-primary/10 rounded-[2.5rem] p-12 text-center shadow-2xl space-y-6">
            <div className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={40} />
            </div>
            <h2 className="font-serif text-3xl">Reservation Received!</h2>
            <p className="text-primary/70 max-w-md mx-auto text-sm leading-relaxed">
              Thank you, <strong className="text-primary">{formData.name}</strong>. We have locked in your booking for <strong className="text-primary">{formData.eventDate}</strong> at <strong className="text-primary">{formData.eventTime}</strong>. We will contact you via WhatsApp to finalize details.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <button 
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-full border border-primary/20 text-xs font-bold tracking-widest uppercase hover:bg-primary/5 transition-all cursor-pointer"
              >
                Book Another Event
              </button>
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded-full bg-primary text-background text-xs font-bold tracking-widest uppercase hover:bg-primary/90 transition-all shadow-md cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
