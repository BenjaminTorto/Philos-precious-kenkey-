import EventBooking from './pages/EventBooking';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import Home from './pages/Home';
import PlaceOrder from './pages/PlaceOrder';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import CartDrawer from './components/layout/CartDrawer';

function Navbar() {
  const { cart, setIsCartOpen } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fdfcfb]/85 backdrop-blur-xl border-b border-primary/10 px-6 py-4 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-serif text-xl font-medium tracking-tight">
          PHILOS PRECIOUS KENKEY
        </Link>
        <div className="flex items-center gap-6 font-sans text-sm">
          <Link to="/" className="text-primary/70 hover:text-primary transition-colors">Home</Link>
          <Link to="/place-order" className="text-primary/70 hover:text-primary transition-colors">Place Order</Link>
          <Link to="/my-orders" className="text-primary/70 hover:text-primary transition-colors">My Orders</Link>
          <Link to="/track" className="text-primary/70 hover:text-primary transition-colors">Track</Link>
          <Link to="/events" className="text-primary/70 hover:text-primary transition-colors font-medium text-orange-700">Events</Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-primary text-background px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
          >
            <ShoppingBag size={16} />
            <span>{totalItems}</span>
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
