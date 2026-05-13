import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="min-h-[90vh] py-16 px-4 md:px-8 max-w-7xl mx-auto relative">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-main/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl md:text-6xl font-syne font-black text-white mb-6">
          Investissez dans votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-main to-green-bright">Avenir</span>
        </h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          Choisissez le plan qui correspond à vos besoins et commencez à optimiser vos finances avec notre intelligence artificielle.
        </p>
      </div>

      <div className="flex justify-center items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-gradient-to-b from-bg-surface to-bg-card border-2 border-green-main shadow-[0_0_50px_rgba(22,163,74,0.2)] rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-bright via-green-main to-green-bright" />
          <div className="absolute -top-10 -right-10 text-green-main/10">
            <Star size={200} fill="currentColor" />
          </div>
          
          <div className="mb-6">
            <span className="bg-green-main/20 text-green-bright text-xs font-black px-4 py-1.5 rounded-full border border-green-main/30 uppercase tracking-widest">
              Offre Exclusive
            </span>
            <h2 className="text-4xl md:text-5xl font-syne font-black text-white mt-4 uppercase">ABONNEMENT ANNUEL</h2>
          </div>
          
          <div className="mb-10">
            <div className="flex items-baseline justify-center">
              <span className="text-7xl md:text-8xl font-black text-white tracking-tighter">2000</span>
              <span className="text-2xl font-bold text-green-bright ml-2">DH</span>
            </div>
            <p className="text-text-muted uppercase font-black tracking-widest text-xs mt-2">Accès illimité pendant 12 mois</p>
          </div>
          
          <ul className="space-y-5 mb-12 w-full text-left">
            {[
              "Accès complet à toutes les analyses IA",
              "Academy MOUSTAKBALI (Tous les niveaux)",
              "Signaux de trading et simulations PRO",
              "Consultation prioritaire avec nos experts",
              "Support technique VIP 24/7",
              "Mises à jour exclusives et nouvelles fonctionnalités"
            ].map((feature, i) => (
              <li key={i} className="flex items-start bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-green-main/30 transition-colors">
                <Check size={20} className="text-green-bright mr-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base text-white font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Link 
            to="/payment"
            className="w-full py-5 bg-green-main hover:bg-green-bright text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(22,163,74,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center text-xl uppercase tracking-widest group"
          >
            <span>Souscrire Maintenant</span>
            <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <p className="mt-8 text-white/30 text-[10px] font-bold uppercase tracking-widest flex items-center">
            <Lock size={12} className="mr-2" /> Paiement sécurisé via cryptage SSL
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
