import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Headset, DollarSign, Megaphone, Briefcase, Cpu } from 'lucide-react';

const TEAM = [
  { name: "Dougmi Zouhair", role: "Founder & CEO", dept: "Management" },
  { name: "Khounnati Youssef", role: "CO - FOUNDER", dept: "Informatique" },
  { name: "Aziz Yassine", role: "COMMUNICATION", dept: "Finance" },
  { name: "Lablak Oumaima", role: "COMMUNICATION", dept: "Marketing" },
  { name: "Bana Aya", role: "FINANCE", dept: "Informatique" },
  { name: "Jaa Hiba", role: "MARKETING", dept: "Communication" },
  { name: "Fawzi Fatima Ezzahra", role: "MARKETING", dept: "Commercial" },
  { name: "Karime Mohammed", role: "CLIENT SERVICE", dept: "Client Service" },
  { name: "Boulaghouaou Anass", role: "COMMERCIAL ET VENTE", dept: "Marketing" },
  { name: "Dahmani Sondosse", role: "INFORMATIQUE", dept: "Finance" },
  { name: "El Badra houmam", role: "INFORMATIQUE", dept: "Informatique" },
  { name: "Debbagh Khalid", role: "INFORMATIQUE", dept: "Management" },
  { name: "Aderbaz Sara", role: "INFORMATIQUE", dept: "Informatique" }
];

const About = () => {
  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 md:mb-32"
      >
        <h3 className="text-green-bright font-black uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 md:mb-6">Notre Équipe</h3>
        <h1 className="text-4xl md:text-8xl font-syne font-black text-white leading-tight uppercase tracking-tighter mb-6 md:mb-8">
          LES VISAGES DE <span className="text-green-bright italic">MOUSTAKBALI.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Une synergie de 13 talents dévoués à redéfinir l'intelligence financière au Maroc.
        </p>
      </motion.div>

      {/* TEAM GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-32">
        {TEAM.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="bg-bg-card border border-border p-8 rounded-3xl group hover:border-green-main transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-main opacity-5 rounded-full blur-3xl -mr-12 -mt-12" />

            <div className="w-20 h-20 rounded-2xl bg-green-main/10 border border-green-main/20 mb-6 flex items-center justify-center text-green-bright group-hover:bg-green-main group-hover:text-black transition-all">
              <Users size={32} />
            </div>

            <h4 className="text-xl font-black text-white leading-tight mb-2 uppercase tracking-tighter">
              {member.name}
            </h4>
            <p className="text-green-bright text-xs font-black uppercase tracking-widest mb-6">
              {member.role}
            </p>


            <div className="flex items-center space-x-4 opacity-30 group-hover:opacity-100 transition-opacity text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:text-green-bright transition-colors">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
              </svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:text-green-bright transition-colors">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:text-green-bright transition-colors">
                <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MISSION SECTION */}
      <div className="bg-bg-card border border-border rounded-[2rem] md:rounded-[3rem] p-8 md:p-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-main/5 blur-[120px] pointer-events-none" />
        <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-6xl font-syne font-black text-white leading-tight mb-6 md:mb-8 uppercase tracking-tighter">
              NOTRE <span className="text-green-bright">MISSION.</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              Au-delà des chiffres, notre but est de créer un impact durable dans l'économie marocaine en rendant la finance accessible, ludique et intelligente pour tous.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-2xl font-black text-white mb-2">100%</h4>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Digital</p>
              </div>
              <div>
                <h4 className="text-2xl font-black text-white mb-2">24/7</h4>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Support</p>
              </div>
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-12 rounded-3xl">
            <p className="text-2xl font-syne font-medium italic text-white/80 leading-relaxed">
              "L'innovation financière n'est pas une option, c'est une nécessité pour le futur de notre jeunesse."
            </p>
            <p className="mt-8 text-green-bright font-black uppercase tracking-widest text-sm">— Team Moustakbali</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
