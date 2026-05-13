import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, User, Mail, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

const Payment = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Payment logic would go here
    alert("Procédure de paiement initiée. Redirection vers la passerelle sécurisée...");
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-bright/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative z-10"
      >
        {/* Left Side: Summary */}
        <div className="md:w-5/12 bg-green-main/5 p-8 border-b md:border-b-0 md:border-r border-white/5">
          <h2 className="text-2xl font-syne font-black text-white mb-8">Votre Commande</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
              <div>
                <p className="text-xs text-white/50 uppercase font-black tracking-widest">Plan</p>
                <p className="text-white font-bold">ABONNEMENT ANNUEL</p>
              </div>
              <p className="text-green-bright font-black">2000 DH</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Sous-total</span>
                <span className="text-white">2000 DH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">TVA (20%)</span>
                <span className="text-white">0.00 DH</span>
              </div>
              <div className="h-px bg-white/10 my-4" />
              <div className="flex justify-between text-lg font-black">
                <span className="text-white">TOTAL</span>
                <span className="text-green-bright">2000 DH</span>
              </div>
            </div>

            <div className="bg-green-bright/10 p-4 rounded-xl border border-green-bright/20 flex items-start space-x-3">
              <ShieldCheck className="text-green-bright shrink-0" size={18} />
              <p className="text-[10px] text-green-bright/80 font-medium leading-relaxed">
                Paiement 100% sécurisé. Vos données sont cryptées et traitées selon les normes de sécurité bancaire les plus strictes.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 lg:p-12">
          <div className="flex items-center space-x-2 mb-8">
            <Lock size={16} className="text-white/40" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Paiement Sécurisé</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-green-bright transition-colors" size={18} />
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Nom Complet"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-green-bright focus:bg-white/10 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-green-bright transition-colors" size={18} />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Adresse E-mail"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-green-bright focus:bg-white/10 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative group">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-green-bright transition-colors" size={18} />
                <input 
                  type="text" 
                  name="cardNumber"
                  placeholder="Numéro de Carte"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-green-bright focus:bg-white/10 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="expiry"
                  placeholder="MM/AA"
                  className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-green-bright focus:bg-white/10 transition-all"
                  onChange={handleChange}
                  required
                />
                <input 
                  type="text" 
                  name="cvv"
                  placeholder="CVV"
                  className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-green-bright focus:bg-white/10 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-green-bright text-black font-black py-4 rounded-xl uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(157,253,36,0.3)]"
            >
              <span>Payer 2000 DH</span>
              <ArrowRight size={18} />
            </button>

            <div className="flex items-center justify-center space-x-6 grayscale opacity-30 mt-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Payment;
