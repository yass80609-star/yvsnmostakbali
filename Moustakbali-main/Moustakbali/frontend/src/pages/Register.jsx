import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState('annuel');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      register(fullName, email, password, plan);
      toast.success('Inscription réussie ! Bienvenue sur MOUSTAKBALI.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-bg-card border border-border p-8 rounded-2xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-main to-green-bright" />
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-syne font-bold text-white">Rejoignez-nous</h2>
          <p className="text-text-muted mt-2">Créez votre compte MOUSTAKBALI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nom complet</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full bg-bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-main transition-colors"
                placeholder="Ahmed El Mansouri"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-main transition-colors"
                placeholder="vous@exemple.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-main transition-colors"
                placeholder="Minimum 6 caractères"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Confirmer le mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-main transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-green-main hover:bg-green-mid text-black font-bold py-3 rounded-lg flex items-center justify-center transition-all shadow-[0_0_15px_rgba(22,163,74,0.3)] mt-6"
          >
            S'inscrire <ArrowRight className="ml-2" size={20} />
          </button>
        </form>

        <div className="mt-8 p-4 bg-green-main/5 border border-green-main/10 rounded-xl flex items-start space-x-3">
          <div className="w-2 h-2 mt-1.5 rounded-full bg-green-bright shrink-0 animate-pulse" />
          <p className="text-[10px] text-gray-400 leading-relaxed uppercase font-black tracking-[0.05em]">
            En vous inscrivant, vous confirmez avoir <span className="text-white">plus de 18 ans</span> et acceptez notre politique de <span className="text-green-bright">confidentialité financière</span>. Vos données sont protégées par cryptage AES-256.
          </p>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-green-bright font-medium hover:underline">
            Se connecter
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
