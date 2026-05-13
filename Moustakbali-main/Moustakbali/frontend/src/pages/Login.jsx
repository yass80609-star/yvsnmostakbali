import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      login(email, password, rememberMe);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Email ou mot de passe incorrect');
    }
  };

  const handleForgotPassword = () => {
    toast('Contactez le support', { icon: 'ℹ️' });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-bg-card border border-border p-8 rounded-2xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-main to-green-bright" />
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-syne font-bold text-white">Bon retour !</h2>
          <p className="text-text-muted mt-2">Connectez-vous pour accéder à votre espace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-300">Mot de passe</label>
              <button type="button" onClick={handleForgotPassword} className="text-xs text-green-bright hover:underline">
                Mot de passe perdu ?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-green-main transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-bg-surface text-green-main focus:ring-green-main focus:ring-offset-bg-card"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-400">Souviens-toi de moi</label>
          </div>

          <button 
            type="submit"
            className="w-full bg-green-main hover:bg-green-mid text-black font-bold py-3 rounded-lg flex items-center justify-center transition-all shadow-[0_0_15px_rgba(22,163,74,0.3)]"
          >
            Se connecter <ArrowRight className="ml-2" size={20} />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-green-bright font-medium hover:underline">
            S'inscrire
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
