import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ShieldCheck, LogOut, Bell, LayoutDashboard, PackageSearch, BarChart3, TrendingUp, DollarSign, ToggleLeft, ToggleRight, Clock, Trophy } from 'lucide-react';
import { supabase } from '../config/supabase';

export default function AdminDashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'inventory', 'analytics'
  
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Orders
      let activeOrders = [];
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (!orderError && orderData) activeOrders = orderData;
      } catch (e) {}
      
      // Grab test orders from local storage
      const localOrders = JSON.parse(localStorage.getItem('philos_orders') || '[]');
      
      // Combine them and update the dashboard state
      setOrders([...localOrders, ...activeOrders]);

      // Fetch Inventory
      const { data: invData, error: invError } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: false });
      if (invError) throw invError;
      setInventory(invData || []);

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders((prev) => [payload.new, ...prev]);
          setNewOrderAlert(true);
          setTimeout(() => setNewOrderAlert(false), 6000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem('philos_admin_auth');
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Try to update Supabase, but don't break if it fails
      try { await supabase.from('orders').update({ status: newStatus }).eq('id', orderId); } catch(e) {}
      
      // Update UI state
      const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      setOrders(updatedOrders);
      
      // Update localStorage so the tracking page sees it!
      const localOrders = JSON.parse(localStorage.getItem('philos_orders') || '[]');
      const updatedLocal = localOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      localStorage.setItem('philos_orders', JSON.stringify(updatedLocal));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

    const toggleInventory = async (name, currentStatus) => {
    try {
      // Try to update Supabase, but don't break if it fails
      try { await supabase.from('menu_items').update({ is_available: !currentStatus }).eq('name', name); } catch(e) {}
      
      const updatedInventory = inventory.map(item => item.name === name ? { ...item, is_available: !currentStatus } : item);
      setInventory(updatedInventory);
      localStorage.setItem('philos_inventory', JSON.stringify(updatedInventory));
    } catch (err) {
      console.error('Error updating inventory:', err);
    }
  };

  // --- Analytics Calculations ---
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const pendingOrders = orders.filter(o => o.status !== 'Completed').length;

  const itemCounts = {};
  const hourCounts = {};

  orders.forEach(order => {
    // Tally Best Sellers
    order.cart_items?.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
    });

    // Tally Peak Hours (using the local time it was created)
    const hour = new Date((order.created_at || order.date)).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const topItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const sortedHours = Object.entries(hourCounts).sort((a, b) => b[1] - a[1]);
  let peakHourText = "Not enough data yet";
  if (sortedHours.length > 0) {
    const peakHour = parseInt(sortedHours[0][0]);
    const ampm = peakHour >= 12 ? 'PM' : 'AM';
    const hr12 = peakHour % 12 || 12;
    const endHour = (peakHour + 1) % 24;
    const endAmpm = endHour >= 12 ? 'PM' : 'AM';
    const endHr12 = endHour % 12 || 12;
    peakHourText = `${hr12}:00 ${ampm} - ${endHr12}:00 ${endAmpm}`;
  }

  return (
    <div className="min-h-screen bg-background text-primary px-6 pt-24 pb-32 max-w-6xl mx-auto font-sans relative">
      
      {/* Live Order Alert */}
      {newOrderAlert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-primary text-background px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <Bell size={18} className="text-accent" />
          <span className="text-xs font-bold uppercase tracking-wider">New Order Received!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-accent mb-1">
            <ShieldCheck size={18} />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Admin Portal</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl">Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 bg-surface border border-primary/10 px-5 py-2.5 rounded-full text-xs font-bold uppercase hover:border-primary/30 transition-all shadow-sm">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <button onClick={handleSignOut} className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 px-5 py-2.5 rounded-full text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-all shadow-sm">
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 border-b border-primary/10 pb-4 no-scrollbar">
        {[
          { id: 'orders', label: 'Live Orders', icon: LayoutDashboard },
          { id: 'inventory', label: 'Inventory Manager', icon: PackageSearch },
          { id: 'analytics', label: 'Sales & Analytics', icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-primary text-background shadow-md' : 'bg-surface text-primary/60 border border-primary/10 hover:text-primary'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Live Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface rounded-3xl p-6 md:p-8 border border-primary/10 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary/10 pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-xl font-bold">#{order.id.toUpperCase()}</span>
                    <span className="text-xs text-accent uppercase tracking-wider">{new Date((order.created_at || order.date)).toLocaleTimeString()}</span>
                  </div>
                  {order.scheduled_time && (
                    <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase mb-2">
                      Pre-Order: {order.scheduled_time}
                    </div>
                  )}
                  <p className="text-sm font-medium">Customer: <strong className="text-primary">{order.customer_name || order.name || 'Guest'}</strong> ({order.customer_phone || order.phone || 'N/A'})</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {['Pending', 'Preparing', 'Out for Delivery', 'Completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(order.id, status)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        order.status === status ? 'bg-primary text-background' : 'bg-background border border-primary/10 text-primary/60 hover:text-primary'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-primary/80">
                <div>
                  <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">Details</p>
                  {order.address && <p><strong>Address:</strong> {order.address}</p>}
                  {order.dietary_notes && <p><strong>Notes:</strong> {order.dietary_notes}</p>}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">Items (GHC {order.total})</p>
                  {(order.cart_items || order.items)?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span>{item.quantity}x {item.name}</span>
                      <span>GHC {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Inventory Manager */}
      {activeTab === 'inventory' && (
        <div className="bg-surface rounded-3xl p-8 border border-primary/10 shadow-xl">
          <h2 className="font-serif text-2xl mb-6">Menu Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inventory.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 bg-background rounded-2xl border border-primary/10">
                <div>
                  <p className="font-serif font-medium text-lg">{item.name}</p>
                  <p className="text-xs text-accent uppercase tracking-widest">{item.category}</p>
                </div>
                <button 
                  onClick={() => toggleInventory(item.name, item.is_available)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${item.is_available ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}
                >
                  {item.is_available ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  <span>{item.is_available ? 'In Stock' : 'Sold Out'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Level Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface rounded-3xl p-8 border border-primary/10 shadow-xl">
              <DollarSign className="text-accent mb-4" size={24} />
              <p className="text-xs uppercase tracking-widest text-primary/60 mb-1">Total Revenue</p>
              <p className="font-serif text-4xl">GHC {totalRevenue}</p>
            </div>
            <div className="bg-surface rounded-3xl p-8 border border-primary/10 shadow-xl">
              <TrendingUp className="text-green-500 mb-4" size={24} />
              <p className="text-xs uppercase tracking-widest text-primary/60 mb-1">Completed Orders</p>
              <p className="font-serif text-4xl">{completedOrders}</p>
            </div>
            <div className="bg-primary text-background rounded-3xl p-8 shadow-xl">
              <LayoutDashboard className="text-background/60 mb-4" size={24} />
              <p className="text-xs uppercase tracking-widest text-background/60 mb-1">Active Queue</p>
              <p className="font-serif text-4xl">{pendingOrders} Pending</p>
            </div>
          </div>

          {/* Deep Insights Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* Top Selling Items */}
            <div className="bg-surface rounded-3xl p-8 border border-primary/10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="text-accent" size={24} />
                <h3 className="font-serif text-2xl">Best Selling Food</h3>
              </div>
              
              {topItems.length > 0 ? (
                <div className="space-y-4">
                  {topItems.map(([name, count], index) => (
                    <div key={name} className="flex justify-between items-center border-b border-primary/5 pb-3">
                      <span className="text-sm font-medium">{index + 1}. {name}</span>
                      <span className="text-xs bg-primary/5 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">{count} sold</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-primary/60">Waiting for orders to determine your best sellers.</p>
              )}
            </div>

            {/* Peak Order Times */}
            <div className="bg-surface rounded-3xl p-8 border border-primary/10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-accent" size={24} />
                <h3 className="font-serif text-2xl">Peak Order Time</h3>
              </div>
              
              <div className="flex flex-col items-center justify-center h-40 bg-primary/5 rounded-2xl border border-primary/10 text-center px-4">
                <p className="text-xs uppercase tracking-widest text-primary/60 mb-2">Busiest Hour for Orders</p>
                <p className="font-serif text-3xl font-bold text-primary">{peakHourText}</p>
                {sortedHours.length > 0 && (
                  <p className="text-xs text-primary/50 mt-3 font-medium">Based on your historical order data</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
