import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Eye, Home, BarChart2, Target, Award, Settings, CheckCircle2, Ticket, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#00C853', '#00E676', '#69F0AE', '#00A144'];

const SIDEBAR_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { id: 'defis', icon: Target, label: 'Défis' },
  { id: 'recompenses', icon: Award, label: 'Récompenses' },
];

const NIVEAUX = [
  { nom: 'BRONZE', min: 0, color: 'text-[#cd7f32]' },
  { nom: 'ARGENT', min: 1000, color: 'text-gray-300' },
  { nom: 'OR', min: 2500, color: 'text-gold' },
  { nom: 'PLATINE', min: 5000, color: 'text-blue-200' },
];

const DEFAULT_DEFIS = [
  { id: 1, nom: 'Épargne Mensuelle', points: 200, progress: 80, done: false },
  { id: 2, nom: 'Budget Repas Respecté', points: 150, progress: 100, done: true },
  { id: 3, nom: 'Zéro Achat Impulsif', points: 300, progress: 40, done: false },
  { id: 4, nom: 'Transport Éco', points: 100, progress: 60, done: false },
  { id: 5, nom: 'Terminer le Quiz Financier', points: 150, progress: 0, done: false },
  { id: 6, nom: 'Jouer au Simulateur de Trading', points: 250, progress: 0, done: false },
];

const REWARDS_DATA = [
  { id: 1, nom: 'Coupon -20% Livre Finance', cost: 500, type: 'coupon' },
  { id: 2, nom: '1 Mois Premium Offert', cost: 1500, type: 'bonus' },
  { id: 3, nom: 'Séance Coaching 30min', cost: 3000, type: 'bonus' },
  { id: 4, nom: 'Coupon -15% Formation', cost: 800, type: 'coupon' },
];

const HISTORIQUE = [
  { mois: 'Jan', points: 400 },
  { mois: 'Fév', points: 800 },
  { mois: 'Mar', points: 1200 },
  { mois: 'Avr', points: 1800 },
  { mois: 'Mai', points: 2300 },
];

const Gamification = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ points_total: 0, points_mois: 0, niveau: 'BRONZE' });
  const [defis, setDefis] = useState(DEFAULT_DEFIS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unlockedRewards, setUnlockedRewards] = useState([]);

  useEffect(() => {
    if (user) {
      const loadData = () => {
        const storedPoints = getStorageItem(`mb_points_${user.id}`, {
          points_total: 2300,
          points_mois: 450,
          niveau: 'ARGENT'
        });
        setData(storedPoints);
        setDefis(getStorageItem(`mb_defis_${user.id}`, DEFAULT_DEFIS));
        setUnlockedRewards(getStorageItem(`mb_rewards_${user.id}`, []));
      };
      
      loadData();
      
      window.addEventListener('pointsUpdated', loadData);
      return () => window.removeEventListener('pointsUpdated', loadData);
    }
  }, [user]);

  const getNiveauDetails = (points) => {
    return NIVEAUX.slice().reverse().find(n => points >= n.min) || NIVEAUX[0];
  };

  const currentNiveau = getNiveauDetails(data.points_total);

  const completeDefi = (defiId) => {
    const defi = defis.find(d => d.id === defiId);
    if (!defi || defi.done) return;

    const newDefis = defis.map(d => d.id === defiId ? { ...d, done: true, progress: 100 } : d);
    setDefis(newDefis);

    const newPoints = data.points_total + defi.points;
    const newNiveau = getNiveauDetails(newPoints).nom;

    const newData = {
      ...data,
      points_total: newPoints,
      points_mois: data.points_mois + defi.points,
      niveau: newNiveau
    };

    setData(newData);
    if (user) {
      setStorageItem(`mb_defis_${user.id}`, newDefis);
      setStorageItem(`mb_points_${user.id}`, newData);
      window.dispatchEvent(new Event('pointsUpdated'));
    }
    toast.success(`Défi validé ! +${defi.points} points`);
  };

  const unlockReward = (reward) => {
    if (data.points_total >= reward.cost) {
      const newPoints = data.points_total - reward.cost;
      const newNiveau = getNiveauDetails(newPoints).nom;
      
      const newData = { ...data, points_total: newPoints, niveau: newNiveau };
      setData(newData);
      
      const newRewards = [...unlockedRewards, reward.id];
      setUnlockedRewards(newRewards);
      
      if (user) {
        setStorageItem(`mb_points_${user.id}`, newData);
        setStorageItem(`mb_rewards_${user.id}`, newRewards);
        window.dispatchEvent(new Event('pointsUpdated'));
      }
      toast.success(`Récompense débloquée : ${reward.nom}`);
    } else {
      toast.error(`Points insuffisants. Il vous manque ${reward.cost - data.points_total} pts.`);
    }
  };

  const defisChartData = defis.map(d => ({
    name: d.nom,
    value: d.progress
  }));

  return (
    <div className="min-h-screen flex max-w-7xl mx-auto pt-4 pb-12 px-4 md:px-8">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-bg-card border border-border rounded-xl p-6 hidden lg:flex flex-col h-[calc(100vh-8rem)] sticky top-24">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center">
             <img src={`https://i.pravatar.cc/100?img=${user?.id ? 12 : 1}`} alt="avatar" className="rounded-full" />
          </div>
          <div>
            <p className="font-bold text-sm text-white truncate">{user?.fullName || 'Utilisateur'}</p>
            <p className={`text-xs font-bold ${currentNiveau.color}`}>{currentNiveau.nom}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-green-main/10 text-green-bright border border-green-main/30' 
                  : 'text-text-muted hover:bg-bg-surface hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-8">
        
        {/* MOBILE TABS */}
        <div className="lg:hidden flex space-x-2 mb-6 overflow-x-auto pb-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${
                activeTab === item.id ? 'bg-green-main text-black' : 'bg-bg-card text-text-muted border border-border'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <h1 className="text-3xl font-syne font-bold text-white mb-8">
          {activeTab === 'dashboard' && 'Votre Progression'}
          {activeTab === 'defis' && 'Défis & Missions'}
          {activeTab === 'recompenses' && 'Boutique de Récompenses'}
        </h1>

        {activeTab === 'dashboard' && (
          <>
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-bg-card border border-border p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-main/5 rounded-full blur-xl -mr-8 -mt-8" />
                <h3 className="text-text-muted text-sm font-medium mb-2">Points Disponibles</h3>
                <p className="text-4xl font-syne font-bold text-white">{data.points_total}</p>
                <p className="text-xs text-green-bright mt-2">+{data.points_mois} ce mois</p>
              </div>
              
              <div className="bg-bg-card border border-border p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <h3 className="text-text-muted text-sm font-medium mb-2">Niveau Actuel</h3>
                <p className={`text-3xl font-syne font-bold ${currentNiveau.color}`}>{currentNiveau.nom}</p>
                <p className="text-xs text-text-muted mt-2">
                  Prochain niveau à {NIVEAUX[NIVEAUX.findIndex(n => n.nom === currentNiveau.nom) + 1]?.min || 'MAX'} pts
                </p>
              </div>
              
              <div className="bg-bg-card border border-border p-6 rounded-xl shadow-lg relative overflow-hidden group">
                <h3 className="text-text-muted text-sm font-medium mb-2">Défis Complétés</h3>
                <p className="text-4xl font-syne font-bold text-gold">
                  {defis.filter(d => d.done).length}/{defis.length}
                </p>
                <p className="text-xs text-text-muted mt-2">Cette semaine</p>
              </div>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-bg-card border border-border p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-syne font-bold mb-4">Défis en cours</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={defisChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {defisChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(157,253,36,0.3)', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-bg-card border border-border p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-syne font-bold mb-4">Progression Historique</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={HISTORIQUE}>
                      <XAxis dataKey="mois" stroke="#00C853" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#00C853" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(157,253,36,0.3)', color: '#fff' }} />
                      <Line type="monotone" dataKey="points" stroke="#00C853" strokeWidth={3} dot={{ r: 4, fill: '#00C853' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'defis' && (
          <div className="bg-bg-card border border-border rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-syne font-bold mb-6 text-text-muted">Complétez ces missions pour gagner des points</h3>
            <div className="space-y-4">
              {defis.map(defi => (
                <div key={defi.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-bg-surface border border-border rounded-lg">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${defi.done ? 'bg-green-main/20 border-green-main text-green-bright' : 'bg-bg-card border-border text-text-muted'}`}>
                      {defi.done ? <CheckCircle2 size={24} /> : <Target size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{defi.nom}</h4>
                      <p className="text-sm text-gold font-medium">+{defi.points} pts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 w-full md:w-1/3">
                    <div className="flex-1 h-2 bg-bg-card rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${defi.done ? 'bg-green-main' : 'bg-green-bright/50'}`}
                        style={{ width: `${defi.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-muted font-bold min-w-[40px]">{defi.progress}%</span>
                    
                    {!defi.done && defi.progress >= 100 ? (
                      <button 
                        onClick={() => completeDefi(defi.id)}
                        className="px-3 py-1 text-xs font-bold bg-green-main text-black hover:bg-green-bright rounded transition-colors"
                      >
                        Valider
                      </button>
                    ) : !defi.done && (
                      <span className="px-3 py-1 text-xs font-bold bg-bg-card border border-border text-text-muted rounded opacity-50">
                        En cours
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recompenses' && (
          <div>
            <div className="bg-bg-surface border border-border p-4 rounded-xl mb-8 flex justify-between items-center shadow-lg">
              <span className="text-text-muted font-medium">Vos points disponibles</span>
              <span className="text-2xl font-syne font-bold text-gold">{data.points_total} pts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REWARDS_DATA.map(reward => {
                const isUnlocked = unlockedRewards.includes(reward.id);
                return (
                  <motion.div 
                    key={reward.id}
                    whileHover={!isUnlocked ? { scale: 1.02 } : {}}
                    className={`border rounded-xl p-6 relative overflow-hidden ${
                      isUnlocked 
                        ? 'bg-green-main/10 border-green-main/30' 
                        : 'bg-bg-card border-border hover:border-green-main/50 shadow-lg'
                    }`}
                  >
                    {isUnlocked && (
                      <div className="absolute top-4 right-4 text-green-bright">
                        <Unlock size={24} />
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isUnlocked ? 'bg-green-main/20 text-green-bright' : 'bg-bg-surface text-gold'}`}>
                      {reward.type === 'coupon' ? <Ticket size={24} /> : <Award size={24} />}
                    </div>
                    
                    <h3 className="text-lg font-syne font-bold text-white mb-2">{reward.nom}</h3>
                    <p className="text-sm text-text-muted mb-6">
                      Utilisez vos points pour débloquer cet avantage exclusif.
                    </p>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <span className="font-bold text-gold">{reward.cost} pts</span>
                      <button
                        onClick={() => unlockReward(reward)}
                        disabled={isUnlocked}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          isUnlocked 
                            ? 'bg-transparent text-green-bright border border-green-bright opacity-50 cursor-not-allowed'
                            : 'bg-green-main hover:bg-green-mid text-black shadow-md'
                        }`}
                      >
                        {isUnlocked ? 'Débloqué' : 'Échanger'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Gamification;
