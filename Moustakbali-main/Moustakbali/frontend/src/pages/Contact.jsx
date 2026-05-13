import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getStorageItem, setStorageItem } from '../utils/storage';
import toast from 'react-hot-toast';
import { User, Mail, MessageSquare, Play } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    if (!formData.nom || !formData.email || !formData.message) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    // Save to localStorage
    const contacts = getStorageItem('mb_contacts', []);
    contacts.push({ ...formData, date: new Date().toISOString() });
    setStorageItem('mb_contacts', contacts);

    // Reset and notify
    toast.success("Message envoyé ✓");
    setFormData({ nom: '', email: '', message: '' });
  };

  return (
    <div className="min-h-[85vh] py-16 px-4 md:px-8 max-w-7xl mx-auto flex items-center">
      <div className="grid md:grid-cols-2 gap-12 items-center w-full">

        {/* TEXT & DECORATION */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-main/10 rounded-full blur-3xl pointer-events-none" />

          <h1 className="text-5xl md:text-7xl font-syne font-black text-white mb-6 leading-tight">
            Parlez avec notre<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-main to-green-bright">equipe.</span>
          </h1>
          <p className="text-lg text-text-muted mb-12 max-w-md">
            Une question sur la plateforme ? Besoin d'un accompagnement personnalisé ? Notre équipe est là pour vous aider.
          </p>

          {/* Contact List */}
          <div className="space-y-4 mt-10">
            <a 
              href="https://www.instagram.com/moustakbali_/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-green-main/10 border border-green-main/20 flex items-center justify-center text-green-bright group-hover:bg-green-main group-hover:text-black transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Instagram</p>
                <p className="text-sm font-bold text-white group-hover:text-green-bright transition-colors">moustakbali_</p>
              </div>
            </a>


            <div className="flex items-center space-x-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-green-main/10 border border-green-main/20 flex items-center justify-center text-green-bright group-hover:bg-green-main group-hover:text-black transition-all">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Email</p>
                <p className="text-sm font-bold text-white group-hover:text-green-bright transition-colors">contact@moustakbali.ma</p>
              </div>
            </div>
          </div>

        </motion.div>

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card border border-border rounded-2xl p-8 shadow-2xl relative z-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nom</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  value={formData.nom}
                  onChange={e => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full bg-bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-main transition-colors"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-main transition-colors"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Message</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 text-gray-500" size={20} />
                <textarea
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-main transition-colors h-32 resize-none"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-main hover:bg-green-mid text-black font-bold py-4 rounded-lg flex items-center justify-center transition-all shadow-[0_0_15px_rgba(22,163,74,0.3)] mt-4"
            >
              PRENDRE UN RENDEZ-VOUS <Play size={16} fill="currentColor" className="ml-2" />
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;
