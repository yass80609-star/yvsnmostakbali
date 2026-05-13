import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Home, PieChart, BookOpen, Gamepad2, Award, LogOut, Ticket, Users, ArrowUpRight, LayoutDashboard, Bot } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { getStorageItem } from '../utils/storage';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const fetchPoints = () => {
      if (user) {
        const storedPoints = getStorageItem(`mb_points_${user.id}`, { points_total: 0 });
        setUserPoints(storedPoints.points_total);
      }
    };
    fetchPoints();
    window.addEventListener('pointsUpdated', fetchPoints);
    return () => window.removeEventListener('pointsUpdated', fetchPoints);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const allNavLinks = [
    { name: 'Home', path: '/', icon: <Home size={16} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { name: 'Analyses', path: '/analyses', icon: <PieChart size={16} /> },
    { name: 'Academy', path: '/academy', icon: <BookOpen size={16} /> },
    { name: 'Outil IA', path: '/ia-tool', icon: <Bot size={16} /> },
    { name: 'Jeux', path: '/gaming', icon: <Gamepad2 size={16} /> },
    { name: 'Défis', path: '/gamification', icon: <Award size={16} /> },
    { name: 'À Propos', path: '/about', icon: <Users size={16} /> },
  ];

  const navLinks = isLoggedIn 
    ? allNavLinks 
    : allNavLinks.filter(link => ['Home', 'À Propos'].includes(link.name));

  return (
    <div className="absolute top-8 left-0 w-full px-6 z-[100] pointer-events-none">
      <nav className="max-w-[1400px] mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full py-3 px-6 flex items-center justify-between shadow-2xl pointer-events-auto transition-all hover:border-white/20">
        
        {/* LEFT: LOGO */}
        <Link to="/" className="flex items-center group shrink-0">
          <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center -ml-2 group-hover:scale-110 transition-transform">
            <img src="/logo/new_logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(157,253,36,0.3)]" />
          </div>
          <div className="flex flex-col ml-1">
            <span className="font-syne font-black text-white text-sm md:text-lg tracking-tighter leading-none">MOUSTAKBALI</span>
            <span className="text-[7px] md:text-[8px] text-green-bright font-black tracking-widest uppercase">PLATEFORME FINANCIÈRE</span>
          </div>
        </Link>

        {/* CENTER: PILL NAV */}
        <div className="hidden lg:flex items-center bg-white/5 border border-white/5 rounded-full p-1.5 space-x-1 ml-12">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${
                  isActive 
                    ? 'bg-green-bright text-black shadow-[0_0_20px_rgba(157,253,36,0.4)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* RIGHT: CTA / PROFILE */}
        <div className="flex items-center space-x-3 ml-4">
          {isLoggedIn ? (
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 pr-4 transition-all hover:bg-white/10 group/profile">
              <Link to="/gamification" className="flex items-center space-x-2 bg-green-bright/10 text-green-bright rounded-full px-3 py-1.5 transition-all hover:bg-green-bright hover:text-black">
                <Ticket size={14} />
                <span className="font-black text-[10px] uppercase tracking-tighter">{userPoints} pts</span>
              </Link>
              
              <div className="flex items-center space-x-3 ml-3">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white font-black text-[10px] border border-white/10">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col hidden md:flex">
                  <span className="text-white font-black text-[10px] uppercase tracking-tighter leading-none">{user?.fullName}</span>
                  <span className="text-white/40 text-[8px] font-bold uppercase tracking-widest mt-0.5">Membre Pro</span>
                </div>
              </div>

              <div className="w-px h-4 bg-white/10 mx-3" />

              <button 
                onClick={handleLogout} 
                className="text-white/20 hover:text-alert-red transition-all transform hover:scale-110"
                title="Déconnexion"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hidden sm:block text-white/60 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Connexion</Link>
              <Link 
                to="/register" 
                className="bg-white text-black px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest flex items-center space-x-2 hover:bg-green-bright hover:scale-105 transition-all shadow-xl group"
              >
                <span>S'inscrire</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <button className="lg:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* FINANCE WRAP (TICKER) - ATTACHED TO BOTTOM OF NAVBAR */}
      <div className="max-w-4xl mx-auto mt-3 px-6">
        <div className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-full py-1.5 pl-2 pr-4 overflow-hidden shadow-xl flex items-center relative group">
          {/* Tag with solid background to 'hide' text behind it */}
          <div className="bg-green-bright text-black text-[8px] font-black px-2.5 py-1 rounded-full mr-4 tracking-tighter shrink-0 z-30 relative shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
            LIVE MARKET
          </div>
          
          {/* Gradient Mask to fade text out as it hits the tag */}
          <div className="absolute left-24 inset-y-0 w-12 bg-gradient-to-r from-black/80 to-transparent z-20 pointer-events-none" />

          <div className="flex-1 overflow-hidden relative z-10">
            <motion.div 
              animate={{ x: [0, -2000] }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="inline-block whitespace-nowrap"
            >
              {[1, 2, 3, 4].map((_, i) => (
                <span key={i} className="text-[7px] md:text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mx-8">
                  BTC: <span className="text-green-bright">$64,230 (+2.4%)</span> • S&P 500: <span className="text-white">5,210 (+0.5%)</span> • MASI: <span className="text-green-bright">13,420 (+1.2%)</span> • GOLD: <span className="text-alert-red">$2,340 (-0.1%)</span> • FED MAINTAINS RATES • NEW CRYPTO REGULATION IN EU • TECH STOCKS RALLY • OIL PRICES STABILIZE • AI BOOM CONTINUES
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* MOBILE NAV OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-3xl z-[90] flex flex-col items-center justify-center space-y-8 p-8 pointer-events-auto lg:hidden">
          <button className="absolute top-8 right-8 text-white" onClick={() => setIsOpen(false)}>
            <X size={32} />
          </button>
          
          <div className="flex flex-col items-center space-y-6 w-full max-w-xs">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-syne font-black text-white hover:text-green-bright transition-colors uppercase tracking-tighter text-center w-full py-4 border-b border-white/5"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {!isLoggedIn ? (
            <div className="flex flex-col space-y-4 w-full max-w-xs mt-8">
              <Link to="/login" onClick={() => setIsOpen(false)} className="py-4 text-center text-white/60 font-black uppercase tracking-widest">Connexion</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="py-4 text-center bg-green-bright text-black rounded-full font-black uppercase tracking-widest">S'inscrire</Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="text-alert-red font-black uppercase tracking-widest mt-8">Déconnexion</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
