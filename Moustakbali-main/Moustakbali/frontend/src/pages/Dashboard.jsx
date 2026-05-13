import React, { useContext, useState, useMemo, useEffect } from 'react';
import { DashboardContext, DashboardProvider } from '../context/DashboardContext';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, X, Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AlertBanner from '../components/AlertBanner';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#00C853', '#00E676', '#69F0AE', '#00A144', '#008C3A', '#007330'];

const DashboardContent = () => {
  const { user } = useContext(AuthContext);
  const { data, updateData, saveData } = useContext(DashboardContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);



  const totalDepenses = useMemo(() => {
    return Object.values(data.depenses).reduce((acc, curr) => acc + Number(curr), 0);
  }, [data.depenses]);

  const totalBudgetMax = useMemo(() => {
    return Object.values(data.budgetMax).reduce((acc, curr) => acc + Number(curr), 0);
  }, [data.budgetMax]);

  const totalRevenus = useMemo(() => {
    return data.revenus.reduce((acc, r) => acc + Number(r.montant), 0);
  }, [data.revenus]);

  const soldePct = totalRevenus > 0
    ? Math.round((Number(data.solde) / totalRevenus) * 100)
    : 100;

  const budgetRestantPct = totalBudgetMax > 0
    ? Math.max(0, Math.round(((totalBudgetMax - totalDepenses) / totalBudgetMax) * 100))
    : 0;

  const notifications = useMemo(() => {
    const notifs = [];
    Object.keys(data.depenses).forEach(cat => {
      const dep = Number(data.depenses[cat]);
      const max = Number(data.budgetMax[cat]);
      if (max > 0 && dep > max) {
        notifs.push({ id: `budget-${cat}`, type: 'danger', title: `Budget ${cat} dépassé`, text: `Dépassement de ${dep - max} DH` });
      }
    });
    if (soldePct <= 20) {
      notifs.push({ id: 'solde-critique', type: 'danger', title: ' Solde critique', text: `✖ Votre solde ne représente plus que ${soldePct}% de vos revenus. Agissez rapidement.` });
    } else if (soldePct <= 40) {
      notifs.push({ id: 'solde-faible', type: 'warning', title: ' Solde faible', text: `✖ Votre solde est à ${soldePct}% de vos revenus habituels. Limitez vos dépenses.` });
    }
    return notifs;
  }, [data, soldePct]);

  const alerts = useMemo(() => {
    const activeAlerts = [];
    Object.keys(data.depenses).forEach(cat => {
      const dep = Number(data.depenses[cat]);
      const max = Number(data.budgetMax[cat]);
      if (max > 0 && dep > max) activeAlerts.push({ categorie: cat, depassement: dep - max });
    });
    return activeAlerts;
  }, [data.depenses, data.budgetMax]);

  const [visibleAlerts, setVisibleAlerts] = useState(alerts);
  React.useEffect(() => { setVisibleAlerts(alerts); }, [alerts]);

  const pieData = Object.keys(data.depenses)
    .filter(k => data.depenses[k] > 0)
    .map(name => ({ name, value: Number(data.depenses[name]) }));

  const barDataCategories = Object.keys(data.budgetMax).map(name => ({
    name,
    Dépenses: Number(data.depenses[name]),
    Budget: Number(data.budgetMax[name])
  }));

  const sourcesRevenusData = data.revenus.map(r => ({ name: r.label, value: Number(r.montant) }));

  const handleUpdate = () => {
    saveData();
    toast.success('Données mises à jour avec succès');
    setIsDrawerOpen(false);
  };

  const handleInputChange = (e, section, key) => {
    updateData({ ...data, [section]: { ...data[section], [key]: e.target.value } });
  };

  const handleRevenuChange = (id, field, value) => {
    const updatedRevenus = data.revenus.map(r => r.id === id ? { ...r, [field]: value } : r);
    updateData({ ...data, revenus: updatedRevenus });
  };

  const addRevenu = () => {
    updateData({ ...data, revenus: [...data.revenus, { id: Date.now(), label: 'Nouveau revenu', montant: 0 }] });
  };

  const removeRevenu = (id) => {
    updateData({ ...data, revenus: data.revenus.filter(r => r.id !== id) });
  };

  return (
    <div className="min-h-screen pt-4 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-bg-card p-4 rounded-xl border border-border mb-6 shadow-lg">
        <h1 className="text-xl font-syne font-bold text-white mb-4 md:mb-0">
          BONJOUR <span className="text-green-bright uppercase">{user?.fullName || 'UTILISATEUR'}</span>
        </h1>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-bg-surface border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-green-main w-full"
            />
          </div>

          {/* BELL */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 border border-border rounded-lg hover:border-green-main hover:text-green-bright transition-colors relative group"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-alert-red rounded-full translate-x-1/3 -translate-y-1/3 animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 bg-bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border flex justify-between items-center bg-bg-surface">
                      <h3 className="font-syne font-bold text-sm flex items-center gap-2">
                        <Bell size={16} className="text-green-bright" />
                        Notifications
                      </h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${notifications.length > 0 ? 'bg-alert-red/20 text-alert-red' : 'bg-green-main/20 text-green-bright'}`}>
                        {notifications.length} alerte(s)
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-border">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center">
                          <p className="text-2xl mb-2"></p>
                          <p className="text-sm text-text-muted"> ✓ Aucune alerte active</p>
                          <p className="text-xs text-text-muted mt-1">Vos finances sont saines !</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif.id} className={`p-4 ${notif.type === 'danger' ? 'bg-alert-red/5 border-l-2 border-alert-red' : 'bg-yellow-500/5 border-l-2 border-yellow-400'}`}>
                            <p className={`text-sm font-bold ${notif.type === 'danger' ? 'text-alert-red' : 'text-yellow-400'}`}>{notif.title}</p>
                            <p className="text-xs text-text-muted mt-1">{notif.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-border bg-bg-surface">
                        <button onClick={() => setIsNotifOpen(false)} className="w-full text-xs text-text-muted hover:text-white transition-colors text-center">
                          Fermer
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>



          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-2 bg-green-main hover:bg-green-mid text-black rounded-lg text-sm font-bold transition-all shadow-[0_0_10px_rgba(22,163,74,0.3)] whitespace-nowrap"
          >
            Modifier mes données
          </button>
        </div>
      </div>

      <AlertBanner alerts={visibleAlerts} onClose={() => setVisibleAlerts([])} />

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Solde Total", value: `${data.solde} DH`, color: "text-white" },
          { label: "Budget Restant", value: `${budgetRestantPct}%`, color: "text-green-bright" },
          { label: "Alertes Actives", value: notifications.length, color: notifications.length > 0 ? "text-alert-red" : "text-white" },
          { label: "Objectifs", value: data.objectifs.length, color: "text-gold" },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-bg-card border border-border p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-green-main/50 transition-colors"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-main/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-green-main/10 transition-colors" />
            <h3 className="text-text-muted text-sm font-medium mb-2 relative z-10">{kpi.label}</h3>
            <p className={`text-3xl font-syne font-bold relative z-10 ${kpi.color}`}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-bg-card border border-border p-6 rounded-xl shadow-lg lg:col-span-1">
          <h3 className="text-lg font-syne font-bold mb-4">Répartition Dépenses</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(157,253,36,0.3)', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-card border border-border p-6 rounded-xl shadow-lg lg:col-span-2">
          <h3 className="text-lg font-syne font-bold mb-4">Budget par Catégorie</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barDataCategories}>
                <XAxis dataKey="name" stroke="#00C853" fontSize={12} />
                <YAxis stroke="#00C853" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(157,253,36,0.3)', color: '#fff' }} />
                <Legend />
                <Bar dataKey="Dépenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Budget" fill="#00C853" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-card border border-border p-6 rounded-xl shadow-lg lg:col-span-2">
          <h3 className="text-lg font-syne font-bold mb-4">Sources de Revenus</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourcesRevenusData} layout="vertical">
                <XAxis type="number" stroke="#00C853" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#00C853" fontSize={12} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(157,253,36,0.3)', color: '#fff' }} />
                <Bar dataKey="value" fill="#00C853" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-card border border-border p-6 rounded-xl shadow-lg lg:col-span-1">
          <h3 className="text-lg font-syne font-bold mb-4">Épargne Trimestrielle</h3>
          <div className="flex flex-col items-center justify-center h-[220px]">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="rgba(157,253,36,0.1)" strokeWidth="10" fill="none" />
                <circle cx="80" cy="80" r="70" stroke="#00C853" strokeWidth="10" fill="none"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * (Math.min(1, data.depenses.Epargne / (data.objectifEpargne || 1))))}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-green-bright">{Math.round((data.depenses.Epargne / (data.objectifEpargne || 1)) * 100)}%</span>
                <span className="text-xs text-text-muted">Atteint</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INPUT DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsDrawerOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-bg-card border-l border-border z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-bg-surface">
                <h2 className="text-xl font-syne font-bold">Modifier mes données</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-green-bright font-bold border-b border-border/50 pb-2">Général</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Solde actuel (DH)</label>
                      <input type="number" value={data.solde} onChange={(e) => updateData({ ...data, solde: e.target.value })}
                        className="w-full bg-bg-surface border border-border rounded p-2 text-sm focus:border-green-main outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Objectif épargne (DH)</label>
                      <input type="number" value={data.objectifEpargne} onChange={(e) => updateData({ ...data, objectifEpargne: e.target.value })}
                        className="w-full bg-bg-surface border border-border rounded p-2 text-sm focus:border-green-main outline-none" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <h3 className="text-green-bright font-bold">Revenus</h3>
                    <button onClick={addRevenu} className="text-xs text-green-main hover:text-green-bright flex items-center">
                      <Plus size={14} className="mr-1" /> Ajouter
                    </button>
                  </div>
                  {data.revenus.map((r) => (
                    <div key={r.id} className="flex space-x-2 items-center">
                      <input type="text" value={r.label} onChange={(e) => handleRevenuChange(r.id, 'label', e.target.value)}
                        className="flex-1 bg-bg-surface border border-border rounded p-2 text-sm focus:border-green-main outline-none" placeholder="Label" />
                      <input type="number" value={r.montant} onChange={(e) => handleRevenuChange(r.id, 'montant', e.target.value)}
                        className="w-24 bg-bg-surface border border-border rounded p-2 text-sm focus:border-green-main outline-none" placeholder="DH" />
                      <button onClick={() => removeRevenu(r.id)} className="text-alert-red hover:text-red-400 p-2"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
                <div className="space-y-6 pt-4">
                  <h3 className="text-green-bright font-bold border-b border-border/50 pb-4">Dépenses & Budgets (DH)</h3>
                  {Object.keys(data.depenses).map((cat) => (
                    <div key={cat} className="grid grid-cols-12 gap-2 items-center mb-6">
                      <label className="col-span-4 text-sm text-white font-bold">{cat}</label>
                      <div className="col-span-4 relative">
                        <span className="text-[9px] text-green-bright font-bold uppercase absolute -top-4 left-0">Dépensé</span>
                        <input type="number" value={data.depenses[cat]} onChange={(e) => handleInputChange(e, 'depenses', cat)}
                          className="w-full bg-bg-surface border border-border rounded p-2 text-sm focus:border-green-main outline-none" />
                      </div>
                      <div className="col-span-4 relative">
                        <span className="text-[9px] text-white/50 font-bold uppercase absolute -top-4 left-0">Max Budget</span>
                        <input type="number" value={data.budgetMax[cat]} onChange={(e) => handleInputChange(e, 'budgetMax', cat)}
                          className="w-full bg-bg-surface border border-border rounded p-2 text-sm focus:border-green-main outline-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-border bg-bg-surface">
                <button onClick={handleUpdate}
                  className="w-full bg-green-main hover:bg-green-mid text-black font-bold py-3 rounded-lg flex items-center justify-center transition-all shadow-lg">
                  <Save size={18} className="mr-2" /> Mettre à jour
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


    </div>
  );
};

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
