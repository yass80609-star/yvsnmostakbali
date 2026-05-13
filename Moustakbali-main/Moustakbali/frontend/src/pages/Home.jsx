import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Play, Star, BookOpen, LineChart, Gamepad2, ArrowRight, CheckCircle2, Users, TrendingUp, Headset, DollarSign, Megaphone, Briefcase, Cpu } from 'lucide-react';
import { useNews } from '../hooks/useNews';
import NewsCard from '../components/NewsCard';
import Finance3D from '../components/Finance3D';

const SERVICES = [
  {
    title: 'Analyses Financières',
    desc: 'Suivez le marché en temps réel et analysez vos investissements.',
    icon: <LineChart size={40} className="text-green-bright" />,
    path: '/analyses'
  },
  {
    title: 'Academy MOUSTAKBALI',
    desc: 'Apprenez la finance pas à pas grâce à nos cours interactifs et notre test de positionnement.',
    icon: <BookOpen size={40} className="text-green-bright" />,
    path: '/academy'
  },
  {
    title: 'Jeux Éducatifs',
    desc: 'Appliquez vos connaissances à travers des simulations de trading et des quiz.',
    icon: <Gamepad2 size={40} className="text-green-bright" />,
    path: '/gaming'
  },
];

const DEPARTMENTS = [
  { name: "MANAGEMENT ET COORDINATION", icon: <Users size={24} />, members: 2 },
  { name: "MARKETING", icon: <TrendingUp size={24} />, members: 2 },
  { name: "CLIENT SERVICE", icon: <Headset size={24} />, members: 2 },
  { name: "FINANCE", icon: <DollarSign size={24} />, members: 2 },
  { name: "COMMUNICATION", icon: <Megaphone size={24} />, members: 1 },
  { name: "COMMERCIAL ET VENTE", icon: <Briefcase size={24} />, members: 2 },
  { name: "INFORMATIQUE", icon: <Cpu size={24} />, members: 2 }
];

const Home = () => {
  const { articles, loading } = useNews('finance+maroc');
  const [balance, setBalance] = useState(42920.00);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // High-volatility jumps between 10k and 90k
      setBalance(Math.random() * 80000 + 10000);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-4 px-4 md:px-8 relative overflow-hidden">
      

      {/* HERO SECTION - REDESIGNED & ENLARGED */}
      <div className="relative max-w-7xl mx-auto min-h-[90vh] md:min-h-[100vh] flex flex-col justify-center items-center overflow-visible mb-0 pt-16 md:pt-16">
        
        {/* Background Big Titles - Stacked specifically behind cards */}
        <div className="absolute top-0 left-0 w-full h-[500px] md:h-[700px] flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden select-none space-y-[-10vh] md:space-y-[-15vh] opacity-60 md:opacity-100">
          {[1, 2].map((i) => (
            <motion.h1 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[30vw] md:text-[25vw] font-syne font-black uppercase tracking-tighter text-transparent"
              style={{ 
                WebkitTextStroke: '1px rgba(0, 200, 83, 0.2)',
                maskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)'
              }}
            >
              MOUSTAKBALI
            </motion.h1>
          ))}
        </div>

        {/* Floating Elements Container - Larger Area */}
        <div className="relative w-full h-[450px] md:h-[650px] flex items-center justify-center z-10 -mt-24 md:-mt-20 scale-[0.7] sm:scale-[0.85] md:scale-100">
          
          {/* Main 3D Cards - Enlarged */}
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
            
            {/* Visa Card 1 (Back) */}
            <motion.div 
              animate={{ y: [-15, 15, -15], rotateX: [5, 12, 5], rotateY: [-5, -12, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-64 h-40 md:w-80 md:h-52 bg-gradient-to-br from-green-950/40 to-black border border-white/5 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-md shadow-2xl transform -translate-x-16 md:-translate-x-32 -translate-y-20 md:-translate-y-28 z-10 opacity-60 md:opacity-100"
            >
              <div className="p-6 md:p-8 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-8 md:w-12 md:h-10 bg-green-main/20 rounded-lg" />
                  <span className="text-white/30 text-lg font-bold italic uppercase">Visa</span>
                </div>
                <div className="text-white/20 text-sm md:text-lg tracking-[3px] md:tracking-[5px]">**** **** **** 8829</div>
              </div>
            </motion.div>

            {/* Mastercard (Middle) */}
            <motion.div 
              animate={{ y: [15, -15, 15], rotateX: [-5, -12, -5], rotateY: [5, 12, 5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-64 h-40 md:w-80 md:h-52 bg-gradient-to-br from-green-900/40 to-black border border-white/5 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-md shadow-2xl transform translate-x-12 md:translate-x-16 -translate-y-12 md:-translate-y-16 z-20 opacity-80 md:opacity-100"
            >
              <div className="p-6 md:p-8 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-8 md:w-12 md:h-10 bg-green-bright/10 rounded-lg" />
                  <div className="flex -space-x-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500/30" />
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-300/30" />
                  </div>
                </div>
                <div className="text-white/20 text-sm md:text-lg tracking-[3px] md:tracking-[5px]">**** **** **** 4412</div>
              </div>
            </motion.div>

            {/* Main Visa Card (Front) - Enlarged */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1, y: [-8, 8, -8] }}
              transition={{ duration: 1, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute w-[320px] h-[190px] md:w-[420px] md:h-[250px] bg-gradient-to-br from-[#061f14] to-black border border-green-main/40 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-2xl shadow-[0_30px_70px_rgba(22,163,74,0.4)] z-30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.3),transparent)]" />
              <div className="p-6 md:p-10 flex flex-col h-full justify-between relative z-10">
                <div className="flex justify-between items-start">
                   <h2 className="text-2xl md:text-3xl font-syne font-black italic text-white tracking-widest uppercase">Visa</h2>
                   <div className="w-14 h-10 md:w-16 md:h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                      <div className="w-8 h-6 md:w-10 md:h-8 bg-green-600/30 rounded-md" />
                   </div>
                </div>
                <div className="space-y-2 md:space-y-4">
                  <div className="text-white/40 text-xs md:text-base font-bold tracking-[0.2em] uppercase">Solde Actuel</div>
                  <div className="flex justify-between items-end">
                    <div className="text-2xl md:text-4xl font-syne font-black text-white tracking-wider">
                      $ {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-bright flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.5)]">
                      <div className="w-5 h-5 md:w-6 md:h-6 text-black font-black text-xl md:text-2xl flex items-center justify-center">+</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Cursors - Hidden on mobile */}
            <motion.div 
              animate={{ x: [0, 80, -40, 0], y: [0, -50, 40, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute left-[5%] md:left-[15%] top-[30%] z-50 pointer-events-none hidden md:block"
            >
              <div className="flex items-center space-x-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L11.5 20L14 14L20 11.5L4 4Z" fill="#4ade80" stroke="white" strokeWidth="2"/>
                </svg>
                <div className="px-4 py-2 bg-green-main text-black text-xs font-bold rounded-lg shadow-2xl border border-white/20">Isabella Amelia</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ x: [0, -100, 60, 0], y: [0, 70, -60, 0] }}
              transition={{ duration: 12, repeat: Infinity, delay: 1 }}
              className="absolute right-[5%] md:right-[15%] top-[70%] z-50 pointer-events-none hidden md:block"
            >
              <div className="flex items-center space-x-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L11.5 20L14 14L20 11.5L4 4Z" fill="white" stroke="black" strokeWidth="1"/>
                </svg>
                <div className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg shadow-2xl">Devil Ron</div>
              </div>
            </motion.div>

            {/* Action Icons - Scaled & simplified on mobile */}
            <div className="absolute inset-0 z-20 pointer-events-none">
               <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -left-[5%] md:left-[5%] bottom-[35%] md:bottom-[25%] flex flex-col items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
                    <LineChart className="text-green-main" size={24} />
                  </div>
                  <span className="text-[8px] md:text-xs text-white/50 mt-2 md:mt-3 font-black uppercase tracking-[0.1em] md:tracking-[0.2em]">Portefeuille</span>
               </motion.div>



               <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute right-[10%] md:right-[20%] bottom-[12%] md:bottom-[15%] flex flex-col items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
                    <Play className="text-green-main" size={24} />
                  </div>
                  <span className="text-[8px] md:text-xs text-white/50 mt-2 md:mt-3 font-black uppercase tracking-[0.1em] md:tracking-[0.2em]">Recharger</span>
               </motion.div>

               <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute -right-[5%] md:right-[5%] bottom-[35%] md:bottom-[25%] flex flex-col items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
                    <Gamepad2 className="text-green-bright" size={24} />
                  </div>
                  <span className="text-[8px] md:text-xs text-white/50 mt-2 md:mt-3 font-black uppercase tracking-[0.1em] md:tracking-[0.2em]">Scanner</span>
               </motion.div>
            </div>

          </div>
        </div>

        {/* Bottom Hero Text & Perspective Shape - Enlarged */}
        <div className="relative w-full z-30 mt-10 md:mt-20 flex flex-col items-center px-4">
          <div className="max-w-5xl text-center mb-10 md:mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl md:text-9xl font-syne font-black text-white leading-[0.9] md:leading-[0.85] tracking-tighter mb-8 md:mb-12"
            >
              Des outils plus <br />
              <span className="text-green-bright italic">Intelligents.</span>
            </motion.h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/login" className="px-10 py-4 md:px-12 md:py-6 bg-white text-black rounded-full font-black text-lg md:text-xl tracking-[0.1em] md:tracking-[0.2em] uppercase hover:bg-green-bright hover:scale-105 transition-all shadow-2xl text-center">
                  Commencer
                </Link>
                <Link to="/about" className="px-10 py-4 md:px-12 md:py-6 border border-white/20 text-white rounded-full font-black text-lg md:text-xl tracking-[0.1em] md:tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all text-center">
                  À Propos
                </Link>
              </div>
              <p className="text-white/50 max-w-sm text-sm md:text-lg text-center md:text-left leading-relaxed">
                Découvrez la nouvelle génération de gestion financière. Analysez les tendances avec l'IA, gérez vos actifs en toute sécurité et maîtrisez les marchés.
              </p>
            </div>
          </div>

          {/* Perspective Shape at the bottom - Larger */}
          <div className="absolute -bottom-24 md:-bottom-32 left-1/2 -translate-x-1/2 w-[200%] h-[300px] md:h-[400px] overflow-hidden pointer-events-none opacity-40 md:opacity-60">
             <div 
               className="w-full h-full bg-gradient-to-t from-green-main to-transparent"
               style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
             />
          </div>
        </div>
      </div>
      
      {/* INTRO VIDEO SECTION */}
      <div className="max-w-7xl mx-auto py-24 px-4 relative mt-20 md:mt-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          {/* Glassmorphic Background for Video */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-main to-green-bright rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-4 md:p-8 flex flex-col md:flex-row items-center gap-12">
              
              {/* Video Container (YouTube Embed to save space) */}
              <div className="w-full md:w-2/3 aspect-video bg-white/5 rounded-3xl overflow-hidden relative border border-white/10">
                <iframe 
                  className="w-full h-full object-cover"
                  src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0&controls=1&rel=0" 
                  title="Moustakbali Intro Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>

              {/* Text Info */}
              <div className="w-full md:w-1/3 text-left">
                <h3 className="text-green-bright font-black uppercase tracking-[0.3em] text-xs mb-4">Présentation</h3>
                <h2 className="text-3xl md:text-5xl font-syne font-black text-white leading-tight mb-6">
                  Découvrez notre <span className="italic">Vision.</span>
                </h2>
                <p className="text-white/50 text-sm md:text-base leading-relaxed mb-8">
                  Une immersion complète dans l'écosystème Moustakbali. Apprenez comment nous révolutionnons l'éducation financière grâce à l'IA et l'innovation.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Stratégie 2026</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-40 h-40 bg-green-main/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-40 h-40 bg-green-bright/10 rounded-full blur-[80px] pointer-events-none" />
      </div>

      {/* SERVICES SECTION */}
      <div className="max-w-7xl mx-auto py-16 border-t border-border mt-32">
        <h2 className="text-3xl md:text-4xl font-syne font-bold text-center mb-12">
          Nos <span className="text-green-bright">Services</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-bg-card border border-border rounded-2xl p-8 hover:border-green-main/50 transition-colors shadow-lg group flex flex-col"
            >
              <div className="mb-6 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-green-main/10 border border-green-main/20 flex items-center justify-center shadow-[0_0_20px_rgba(157,253,36,0.1)] group-hover:bg-green-main/20 transition-all duration-300">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-syne font-bold text-white mb-3">{service.title}</h3>
              <p className="text-text-muted mb-6 flex-grow">{service.desc}</p>
              <Link to={service.path} className="text-sm font-bold text-green-bright flex items-center hover:text-white transition-colors mt-auto">
                Découvrir <ArrowRight size={16} className="ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* EXPERT BANNER */}
      <div className="max-w-7xl mx-auto py-16 border-t border-border">
        <div className="bg-[#041a10] relative overflow-hidden rounded-3xl p-10 md:p-16 shadow-2xl flex flex-col md:flex-row items-center justify-between border border-green-900/30">
          
          {/* Geometrical background shapes */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
            <div className="absolute right-[-10%] top-[-20%] w-96 h-96 bg-green-main rotate-45" />
            <div className="absolute right-[20%] top-[40%] w-64 h-64 bg-green-bright rotate-45" />
            <div className="absolute right-[40%] bottom-[-20%] w-80 h-80 bg-green-mid rotate-45" />
          </div>

          <div className="z-10 max-w-xl mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-syne font-extrabold text-white mb-6 leading-tight">
              Parlez avec <br/>nos experts.
            </h2>
          </div>
          
          <div className="z-10 max-w-sm md:text-right border-l-4 md:border-l-0 md:border-r-4 border-green-main pl-6 md:pl-0 md:pr-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              Bénéficiez d'une consultation personnalisée avec nos experts financiers pour atteindre vos objectifs.
            </p>
          </div>
        </div>
      </div>

      {/* ABOUT US SECTION - SIMPLIFIED */}
      <div className="max-w-7xl mx-auto py-20 md:py-32 px-4 border-t border-border mt-20 md:mt-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-green-bright font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 md:mb-6">À Propos de Nous</h3>
            <h2 className="text-4xl md:text-7xl font-syne font-black text-white leading-tight mb-6 md:mb-8">
              Une Équipe de <span className="text-green-bright italic">13 Experts.</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-12">
              Moustakbali est le fruit d'une synergie entre 13 passionnés de finance et de technologie. Notre mission est de démocratiser l'intelligence financière au Maroc à travers l'innovation constante et l'accompagnement personnalisé.
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center space-x-3 px-8 py-4 bg-green-main text-black font-black uppercase tracking-widest rounded-xl hover:bg-green-mid transition-all group"
            >
              <span>Découvrir l'équipe</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* PRICING SECTION */}
      <div className="max-w-7xl mx-auto py-32 px-4 border-t border-border mt-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-syne font-extrabold text-white mb-6 leading-tight uppercase tracking-tighter">
            Prix <span className="text-green-bright">En Ligne</span>
          </h2>
          <p className="text-gray-400">Accès complet à toutes nos fonctionnalités pour propulser votre avenir financier.</p>
        </div>

        <div className="flex justify-center">
          <motion.div 
            whileHover={{ y: -10 }}
            className="w-full max-w-lg bg-[#061f14] border-2 border-green-main rounded-[2.5rem] p-12 relative overflow-hidden shadow-[0_0_50px_rgba(157,253,36,0.2)]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-main opacity-20 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="text-2xl font-syne font-bold text-white mb-2 uppercase">Abonnement Annuel</h3>
                <p className="text-green-bright font-black uppercase tracking-widest text-[10px]">Accès Illimité</p>
              </div>
              <div className="bg-green-main text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-tighter">Populaire</div>
            </div>

            <div className="mb-12 relative z-10">
              <h3 className="text-7xl font-syne font-black text-white mb-2">2000<span className="text-3xl ml-1">DH</span></h3>
              <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Par an</p>
            </div>

            <div className="space-y-6 mb-12 relative z-10 text-left">
              {[
                "Analyses illimitées du marché",
                "Accès à tous les cours de l'Academy",
                "Signaux de trading en temps réel",
                "Consultation avec experts (1h/mois)",
                "Support prioritaire 24/7"
              ].map((feature, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <CheckCircle2 size={20} className="text-green-main" />
                  <span className="text-white/80 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <Link 
              to="/login" 
              className="w-full py-6 bg-green-main hover:bg-green-bright text-black rounded-2xl transition-all text-center font-black tracking-widest uppercase shadow-xl block relative z-10"
            >
              Souscrire maintenant
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ACTUALITÉS FINANCIÈRES SECTION */}
      <div className="w-full bg-[#051c11] py-16 mt-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-syne font-bold mb-4 text-white">
                Blog & <span className="text-green-bright">Ressources Info</span>
              </h2>
              <p className="text-gray-400">Décryptez les marchés avec nos analyses, guides et actualités financières exclusives.</p>
            </div>
            <Link to="/analyses" className="hidden md:flex text-sm font-bold border border-green-main/30 text-white hover:text-black px-6 py-2 rounded hover:bg-green-main transition-all">
              Voir tout
            </Link>
          </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-bg-card animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <NewsCard article={article} />
              </motion.div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* PARTNERS SECTION */}
      <div className="max-w-7xl mx-auto py-24 px-4 border-t border-border mt-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-syne font-bold text-white mb-4 uppercase tracking-tighter">
            Nos <span className="text-green-bright">Partenaires</span>
          </h2>
          <p className="text-gray-400 font-medium">Ils nous font confiance pour bâtir l'avenir financier.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          {[
            { name: 'BROTHER HOOD', image: '/media__1778708624448.png' },
            { name: 'RUNNING CLUB SAFI', image: '/media__1778708640054.png' }
          ].map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -10, borderColor: 'rgba(0, 200, 83, 0.4)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
              className="w-full md:w-80 h-48 bg-bg-card border border-white/5 rounded-[2rem] flex items-center justify-center p-6 backdrop-blur-xl relative overflow-hidden group transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-main/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                 <div className="w-24 h-24 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all duration-500 shadow-xl overflow-hidden group-hover:border-green-main/30 group-hover:scale-105">
                   <img src={partner.image} alt={partner.name} className="w-full h-full object-contain p-2" />
                 </div>
                 <div className="text-center">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">
                     Partenaire Officiel
                   </span>
                   <p className="text-[12px] font-bold text-green-main mt-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                     {partner.name}
                   </p>
                 </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-green-main/10 rounded-bl-[2rem] -mr-6 -mt-6 group-hover:bg-green-main/20 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;
