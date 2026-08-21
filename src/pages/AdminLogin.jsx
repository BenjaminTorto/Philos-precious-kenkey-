import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminLogin({ setIsAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Change this password to whatever admin passcode you prefer!
  const ADMIN_SECRET = 'philos2026';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      sessionStorage.setItem('philos_admin_auth', 'true');
      setIsAuthenticated(true);
      navigate('/admin');
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex items-center justify-center px-6 font-sans">
      <div className="max-w-md w-full bg-surface rounded-3xl p-8 border border-primary/10 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-accent">
            <ShieldCheck size={24} />
          </div>
          <h1 className="font-serif text-3xl">Admin Portal</h1>
          <p className="text-xs text-primary/60 uppercase tracking-widest">PHILOS PRECIOUS KENKEY</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-primary/40">
              <Lock size={18} />
            </span>
            <input 
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className="w-full bg-background border border-primary/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-primary placeholder-primary/40 focus:outline-none focus:border-primary/40 transition-colors shadow-sm"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center font-medium">Incorrect password. Please try again.</p>
          )}

          <button 
            type="submit"
            className="w-full py-4 rounded-full bg-primary text-background font-medium hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Access Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => navigate('/')}
            className="text-xs uppercase tracking-widest text-accent hover:text-primary transition-colors font-medium"
          >
            ← Return to Storefront
          </button>
        </div>

      </div>
    </div>
  );
}
