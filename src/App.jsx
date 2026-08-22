import EventBooking from './pages/EventBooking';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import Home from './pages/Home';
import PlaceOrder from './pages/PlaceOrder';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import CartDrawer from './components/layout/CartDrawer';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/place-order', label: 'Place Order' },
  { to: '/my-orders', label: 'My Orders' },
  { to: '/track', label: 'Track' },
  { to: '/events', label: 'Events', accent: true },
];

function Navbar() {
  const { cart, setIsCartOpen } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // Close the menu whenever the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close the menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fdfcfb]/85 backdrop-blur-xl border-b border-primary/10 px-6 py-4 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-serif text-xl font-medium tracking-tight">
          PHILOS PRECIOUS KENKEY
        </Link>

        <div className="flex items-center gap-3">
          {/* Circular menu button — holds every page link so the bar never crowds the screen */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              className="w-11 h-11 rounded-full bg-primary text-background flex items-center justify-center shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#fdfcfb] border border-primary/10 rounded-2xl shadow-lg py-2 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2.5 text-sm font-sans transition-colors hover:bg-primary/5 ${
                      link.accent ? 'text-orange-700 font-medium' : 'text-primary/80'
                    } ${location.pathname === link.to ? 'bg-primary/5' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
            className="w-11 h-11 rounded-full bg-primary text-background flex items-center justify-center relative shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
          >
            <ShoppingBag size={16} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-700 text-white text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('philos_admin_auth') === 'true'
  );

  return (
    <CartProvider>
      <Router>
        <CartDrawer />
        <Routes>
          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />

          {/* Protected Admin Dashboard Route */}
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? (
                <AdminDashboard setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            } 
          />

          {/* Customer Routes - Includes navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              <div className="pt-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/place-order" element={<PlaceOrder />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/track" element={<TrackOrder />} />
                  <Route path="/events" element={<EventBooking />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                </Routes>
              </div>
            </>
          } />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
