import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, TrendingUp, Building2, Target, X, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { getStorageItem, setStorageItem } from '../utils/storage';

const DEFAULT_DEFIS = [
  { id: 1, nom: 'Épargne Mensuelle', points: 200, progress: 80, done: false },
  { id: 2, nom: 'Budget Repas Respecté', points: 150, progress: 100, done: true },
  { id: 3, nom: 'Zéro Achat Impulsif', points: 300, progress: 40, done: false },
  { id: 4, nom: 'Transport Éco', points: 100, progress: 60, done: false },
  { id: 5, nom: 'Terminer le Quiz Financier', points: 150, progress: 0, done: false },
  { id: 6, nom: 'Jouer au Simulateur de Trading', points: 250, progress: 0, done: false },
  { id: 7, nom: 'Gérer un budget mensuel', points: 200, progress: 0, done: false },
];

const GAMES = [
  {
    id: 'quiz',
    title: 'FINANCE QUIZ',
    icon: <Gamepad2 size={40} className="text-green-bright" />,
    desc: 'Testez vos connaissances financières rapidement et gagnez des points pour débloquer des récompenses.',
  },
  {
    id: 'trading',
    title: 'TRADING SIMULATOR',
    icon: <TrendingUp size={40} className="text-green-bright" />,
    desc: 'Simulateur de marché boursier. 30 jours pour maximiser vos gains.',
    disabled: false
  },
  {
    id: 'simcity',
    title: 'BUDGET MANAGER',
    icon: <Building2 size={40} className="text-green-bright" />,
    desc: 'Gérez votre budget mensuel avec intelligence. Affrontez les imprévus !',
    disabled: false
  }
];

const QUIZ_QUESTIONS = [
  { q: "L'intérêt composé c'est :", options: ["Des intérêts calculés uniquement sur le capital", "Des intérêts calculés sur le capital et les intérêts passés", "Une taxe bancaire"], a: 1, difficulty: 'normal' },
  { q: "Un actif financier liquide est :", options: ["Difficile à vendre", "Facilement convertible en cash", "Une cryptomonnaie uniquement"], a: 1, difficulty: 'normal' },
  { q: "Le but de la diversification est de :", options: ["Maximiser les risques", "Réduire les risques", "Payer moins d'impôts"], a: 1, difficulty: 'normal' },
  { q: "L'effet de levier en immobilier permet de :", options: ["Payer moins de notaire", "Acheter avec l'argent de la banque", "Vendre plus vite"], a: 1, difficulty: 'hard' },
  { q: "Qu'est-ce qu'un ETF ?", options: ["Un prêt bancaire", "Un fonds qui réplique un indice boursier", "Une monnaie numérique"], a: 1, difficulty: 'hard' },
  { q: "Le ratio cours/bénéfice (PER) indique :", options: ["La rentabilité du dividende", "La cherté d'une action par rapport à ses profits", "Le nombre d'employés"], a: 1, difficulty: 'expert' },
  { q: "En cas d'inflation, le pouvoir d'achat :", options: ["Augmente", "Diminue", "Reste stable"], a: 1, difficulty: 'normal' },
  { q: "Qu'est-ce qu'une plus-value ?", options: ["La perte lors d'une vente", "Le profit réalisé lors de la revente d'un actif", "Un frais bancaire"], a: 1, difficulty: 'normal' }
];

const TradingSimulator = ({ onClose, user }) => {
  const INITIAL_CASH = 10000;
  const INITIAL_STOCKS = [
    { ticker: 'NOVA', name: 'Nova Energy Corp', price: 120.00, prevPrice: 120.00, shares: 0 },
    { ticker: 'BNKX', name: 'BankEx Financial', price: 85.50, prevPrice: 85.50, shares: 0 },
    { ticker: 'ZYTE', name: 'Zyte Technologies', price: 210.25, prevPrice: 210.25, shares: 0 },
    { ticker: 'GRWN', name: 'GreenLeaf Foods', price: 45.00, prevPrice: 45.00, shares: 0 },
    { ticker: 'MDRX', name: 'Medrix Health', price: 150.75, prevPrice: 150.75, shares: 0 }
  ];

  const [cash, setCash] = useState(INITIAL_CASH);
  const [day, setDay] = useState(1);
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [logs, setLogs] = useState([{ day: 1, text: 'Welcome to Trading Simulator. You have 30 days to maximize your net worth.', type: 'info' }]);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const portfolioValue = stocks.reduce((sum, s) => sum + s.price * s.shares, 0);
  const netWorth = cash + portfolioValue;
  const returnPct = ((netWorth - INITIAL_CASH) / INITIAL_CASH) * 100;

  const handleNextDay = () => {
    if (day >= 30) {
      setGameOver(true);
      if (user && returnPct > 0) {
        // Unlock trading defi
        const defis = getStorageItem(`mb_defis_${user.id}`, DEFAULT_DEFIS);
        const newDefis = defis.map(d => d.id === 6 ? { ...d, progress: 100 } : d);
        setStorageItem(`mb_defis_${user.id}`, newDefis);

        const rewardPoints = Math.floor(returnPct * 10);
        const pointsData = getStorageItem(`mb_points_${user.id}`, { points_total: 0, points_mois: 0, niveau: 'BRONZE' });
        const newTotal = pointsData.points_total + rewardPoints;
        setStorageItem(`mb_points_${user.id}`, { ...pointsData, points_total: newTotal, points_mois: pointsData.points_mois + rewardPoints });
        window.dispatchEvent(new Event('pointsUpdated'));
        toast.success(`You earned ${rewardPoints} points and unlocked a challenge!`);
      }
      return;
    }
    
    let newLogs = [];
    const newStocks = stocks.map(stock => {
      // Base drift between -4% and +4%
      let drift = (Math.random() * 8) - 4;
      
      // Random news event (approx 15% chance per stock per day)
      if (Math.random() < 0.15) {
        const isGood = Math.random() > 0.5;
        const shock = isGood ? 6 : -7;
        drift += shock;
        newLogs.push({ 
          day: day + 1, 
          text: `${stock.ticker}: ${isGood ? 'Positive earnings report.' : 'Supply chain disruption.'} Price shifted.`, 
          type: isGood ? 'success' : 'error' 
        });
      }
      
      const newPrice = Math.max(1, stock.price * (1 + drift / 100));
      return { ...stock, prevPrice: stock.price, price: newPrice };
    });
    
    setStocks(newStocks);
    setDay(day + 1);
    if (newLogs.length > 0) {
      setLogs(prev => [...newLogs, ...prev]);
    }
  };

  const buyStock = (ticker) => {
    const stock = stocks.find(s => s.ticker === ticker);
    if (cash >= stock.price) {
      setCash(prev => prev - stock.price);
      setStocks(prev => prev.map(s => s.ticker === ticker ? { ...s, shares: s.shares + 1 } : s));
      setLogs(prev => [{ day, text: `Bought 1 share of ${ticker} at $${stock.price.toFixed(2)}`, type: 'info' }, ...prev]);
    } else {
      toast.error('Not enough cash');
    }
  };

  const sellStock = (ticker) => {
    const stock = stocks.find(s => s.ticker === ticker);
    if (stock.shares > 0) {
      setCash(prev => prev + stock.price);
      setStocks(prev => prev.map(s => s.ticker === ticker ? { ...s, shares: s.shares - 1 } : s));
      setLogs(prev => [{ day, text: `Sold 1 share of ${ticker} at $${stock.price.toFixed(2)}`, type: 'info' }, ...prev]);
    } else {
      toast.error('No shares to sell');
    }
  };

  const resetGame = () => {
    setCash(INITIAL_CASH);
    setDay(1);
    setStocks(INITIAL_STOCKS);
    setLogs([{ day: 1, text: 'Game restarted.', type: 'info' }]);
    setGameOver(false);
    setHasStarted(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#111] border border-white/10 rounded-xl p-4 max-w-3xl w-full relative max-h-[90vh] flex flex-col shadow-2xl"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white z-10">
        <X size={24} />
      </button>
      
      {!hasStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 md:px-12">
          <div className="w-20 h-20 bg-green-main/10 rounded-full flex items-center justify-center mb-6">
            <TrendingUp size={40} className="text-green-bright" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest mb-4">Trading Simulator</h2>
          <p className="text-text-muted text-sm md:text-base mb-8 leading-relaxed">
            Bienvenue à Wall Street ! Vous commencez avec <strong>10 000 $</strong>. Vous avez exactement <strong>30 jours</strong> pour acheter et vendre des actions et maximiser vos profits.<br/><br/>
            Faites attention : le marché est volatil ! Des événements économiques peuvent faire chuter ou exploser les prix du jour au lendemain. Si vous terminez avec un profit, vous gagnerez des <strong>Points Moustakbali</strong> exclusifs.
          </p>
          <button 
            onClick={() => setHasStarted(true)} 
            className="bg-green-main text-black px-8 py-4 font-black uppercase tracking-widest rounded-lg hover:bg-green-bright transition-all hover:scale-105"
          >
            Commencer l'Aventure
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6 pr-8">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase">Trading Simulator</h2>
            <div className="text-xs md:text-sm font-bold bg-white/10 px-3 py-1 rounded text-white uppercase tracking-wider">Day {day} / 30</div>
          </div>

          {!gameOver ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Dashboard Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-[#1a1a1a] p-3 md:p-4 rounded border border-white/5">
              <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest mb-1">Cash</div>
              <div className="text-lg md:text-xl font-bold text-white">${cash.toFixed(2)}</div>
            </div>
            <div className="bg-[#1a1a1a] p-3 md:p-4 rounded border border-white/5">
              <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest mb-1">Portfolio</div>
              <div className="text-lg md:text-xl font-bold text-white">${portfolioValue.toFixed(2)}</div>
            </div>
            <div className="bg-[#1a1a1a] p-3 md:p-4 rounded border border-white/5">
              <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest mb-1">Net Worth</div>
              <div className="text-lg md:text-xl font-bold text-white">${netWorth.toFixed(2)}</div>
            </div>
            <div className="bg-[#1a1a1a] p-3 md:p-4 rounded border border-white/5">
              <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest mb-1">Return</div>
              <div className={`text-lg md:text-xl font-bold ${returnPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Stock Table */}
          <div className="overflow-x-auto mb-6 bg-[#1a1a1a] rounded border border-white/5">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-[10px] text-white/40 uppercase tracking-widest bg-black/20">
                  <th className="py-3 px-4 w-1/3">Asset</th>
                  <th className="py-3 px-4 w-1/6">Price</th>
                  <th className="py-3 px-4 w-1/6">Change</th>
                  <th className="py-3 px-4 w-16 text-center">Owned</th>
                  <th className="py-3 px-4 w-40 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map(stock => {
                  const pctChange = ((stock.price - stock.prevPrice) / stock.prevPrice) * 100;
                  const isUp = pctChange >= 0;
                  return (
                    <tr key={stock.ticker} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-black text-white text-sm">{stock.ticker}</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-wider">{stock.name}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm text-white">${stock.price.toFixed(2)}</td>
                      <td className={`py-3 px-4 font-mono text-sm ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {isUp ? '+' : ''}{pctChange.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-white">{stock.shares}</td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => buyStock(stock.ticker)} 
                          className="bg-transparent border border-green-500/50 text-green-500 hover:bg-green-500 hover:text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded mr-2 transition-colors"
                        >
                          Buy 1
                        </button>
                        <button 
                          onClick={() => sellStock(stock.ticker)} 
                          disabled={stock.shares === 0}
                          className="bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-red-500"
                        >
                          Sell 1
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mb-6">
            <button 
              onClick={handleNextDay} 
              className="bg-white text-black font-black uppercase tracking-widest px-8 py-3 rounded hover:bg-gray-200 transition-colors w-full md:w-auto shadow-lg"
            >
              {day === 29 ? 'Finish Game (Next Day)' : 'Next Day'}
            </button>
          </div>

          {/* Trade Log */}
          <div className="h-[120px] bg-black rounded border border-white/5 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed">
            {logs.map((log, i) => (
              <div key={i} className="mb-1">
                <span className="text-white/30 mr-3">[{log.day < 10 ? '0'+log.day : log.day}]</span>
                <span className={log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : 'text-white/60'}>
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
          <div className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">Game Over - Day 30</div>
          <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            Final Net Worth:<br/>
            <span className={returnPct >= 0 ? 'text-green-500' : 'text-red-500'}>${netWorth.toFixed(2)}</span>
          </h3>
          <div className={`text-xl font-bold mb-10 ${returnPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            Return: {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%
          </div>
          <button 
            onClick={resetGame} 
            className="bg-white text-black px-8 py-3 font-black uppercase tracking-widest rounded hover:bg-gray-200 transition-colors"
          >
            Play Again
          </button>
          </div>
          )}
        </>
      )}
    </motion.div>
  );
};

const BUDGET_CATEGORIES = [
  { id: 'rent', name: 'Rent', limit: 900, fixed: true },
  { id: 'utilities', name: 'Utilities', limit: 150, fixed: true },
  { id: 'groceries', name: 'Groceries', limit: 400, fixed: false },
  { id: 'transport', name: 'Transport', limit: 200, fixed: false },
  { id: 'entertainment', name: 'Entertainment', limit: 200, fixed: false },
  { id: 'dining', name: 'Dining Out', limit: 200, fixed: false },
  { id: 'savings', name: 'Savings', limit: 400, fixed: false },
  { id: 'misc', name: 'Misc', limit: 200, fixed: false }
];

const EVENTS = [
  {
    title: 'Car broke down',
    desc: 'Your car needs immediate repairs.',
    choices: [
      { text: 'Pay $180 from Transport', cost: 180, category: 'transport', pts: 0 },
      { text: 'Pay $180 from Savings', cost: 180, category: 'savings', pts: 0 },
      { text: 'Skip repairs', cost: 0, category: null, pts: -10 }
    ]
  },
  {
    title: "Friend's birthday dinner",
    desc: 'A close friend invited you out for their birthday.',
    choices: [
      { text: 'Pay $65 from Dining', cost: 65, category: 'dining', pts: 0 },
      { text: 'Pay $65 from Ent.', cost: 65, category: 'entertainment', pts: 0 },
      { text: 'Decline invite', cost: 0, category: null, pts: -5 }
    ]
  },
  {
    title: 'Flash sale: Concert tickets',
    desc: 'Your favorite band is playing nearby.',
    choices: [
      { text: 'Buy $90 from Ent.', cost: 90, category: 'entertainment', pts: 0 },
      { text: 'Pass', cost: 0, category: null, pts: 0 }
    ]
  },
  {
    title: 'Utility spike',
    desc: 'A sudden cold front spiked your heating bill.',
    choices: [
      { text: 'Pay $40 from Utilities', cost: 40, category: 'utilities', pts: 0 },
      { text: 'Pay $40 from Misc', cost: 40, category: 'misc', pts: 0 }
    ]
  }
];

const BudgetManager = ({ onClose, user }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [week, setWeek] = useState(1);
  const [spent, setSpent] = useState({ rent: 0, utilities: 0, groceries: 0, transport: 0, entertainment: 0, dining: 0, savings: 0, misc: 0 });
  const [score, setScore] = useState(100);
  const [logs, setLogs] = useState([{ week: 1, text: 'Game started. Auto-charges for Week 1 will happen when you click Next Week.', type: 'info' }]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const totalSpent = Object.values(spent).reduce((a, b) => a + b, 0);
  const remaining = 3200 - totalSpent;

  let badge = { text: 'On track', color: 'text-green-500' };
  if (score < 50) badge = { text: 'Struggling', color: 'text-red-500' };
  else if (score < 80) badge = { text: 'Watch out', color: 'text-yellow-500' };

  const addSpend = (catId, amount, isEvent = false) => {
    setSpent(prev => {
      const newAmount = prev[catId] + amount;
      const catObj = BUDGET_CATEGORIES.find(c => c.id === catId);
      if (prev[catId] <= catObj.limit && newAmount > catObj.limit) {
        setScore(s => s - 3);
        setLogs(l => [{ week, text: `⚠️ Exceeded budget for ${catObj.name}! (-3 pts)`, type: 'error' }, ...l]);
      }
      return { ...prev, [catId]: newAmount };
    });
    if (!isEvent) {
      setLogs(l => [{ week, text: `Spent $${amount} on ${BUDGET_CATEGORIES.find(c => c.id === catId).name}`, type: 'info' }, ...l]);
    }
  };

  const handleEventChoice = (choice) => {
    if (choice.cost > 0 && choice.category) {
      addSpend(choice.category, choice.cost, true);
      setLogs(l => [{ week, text: `Event resolved: Paid $${choice.cost} from ${BUDGET_CATEGORIES.find(c => c.id === choice.category).name}`, type: 'warning' }, ...l]);
    }
    if (choice.pts < 0) {
      setScore(s => s + choice.pts);
      setLogs(l => [{ week, text: `Event resolved: ${choice.text} (${choice.pts} pts)`, type: 'error' }, ...l]);
    }
    if (choice.cost === 0 && choice.pts === 0) {
      setLogs(l => [{ week, text: `Event resolved: Passed.`, type: 'info' }, ...l]);
    }
    setCurrentEvent(null);
  };

  const handleNextWeek = () => {
    if (week >= 4) {
      let finalScore = score;
      if (remaining >= 0) finalScore += 10;
      if (spent.savings >= 300) finalScore += 5;
      
      setScore(finalScore);
      setGameOver(true);
      
      if (user) {
        const defis = getStorageItem(`mb_defis_${user.id}`, DEFAULT_DEFIS);
        const newDefis = defis.map(d => d.id === 7 ? { ...d, progress: 100 } : d);
        setStorageItem(`mb_defis_${user.id}`, newDefis);

        const rewardPoints = Math.max(0, finalScore * 2);
        const pointsData = getStorageItem(`mb_points_${user.id}`, { points_total: 0, points_mois: 0, niveau: 'BRONZE' });
        const newTotal = pointsData.points_total + rewardPoints;
        setStorageItem(`mb_points_${user.id}`, { ...pointsData, points_total: newTotal, points_mois: pointsData.points_mois + rewardPoints });
        window.dispatchEvent(new Event('pointsUpdated'));
        toast.success(`You earned ${rewardPoints} points and unlocked a challenge!`);
      }
      return;
    }

    setSpent(prev => {
      let next = { ...prev };
      next.rent += (900 / 4);
      next.utilities += (150 / 4);
      return next;
    });
    setLogs(l => [{ week: week + 1, text: `Auto-charged Rent ($225) and Utilities ($37.5).`, type: 'info' }, ...l]);

    if (Math.random() < 0.7) {
      const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      setCurrentEvent(ev);
    }
    setWeek(week + 1);
  };

  const resetGame = () => {
    setWeek(1);
    setSpent({ rent: 0, utilities: 0, groceries: 0, transport: 0, entertainment: 0, dining: 0, savings: 0, misc: 0 });
    setScore(100);
    setLogs([{ week: 1, text: 'Game restarted.', type: 'info' }]);
    setCurrentEvent(null);
    setGameOver(false);
    setHasStarted(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#111] border border-white/10 rounded-xl p-4 max-w-3xl w-full relative max-h-[90vh] flex flex-col shadow-2xl"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white z-10">
        <X size={24} />
      </button>

      {!hasStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 md:px-12 overflow-y-auto">
          <div className="w-20 h-20 bg-green-main/10 rounded-full flex items-center justify-center mb-6">
            <Building2 size={40} className="text-green-bright" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest mb-4">Budget Manager</h2>
          <div className="text-text-muted text-sm md:text-base mb-8 leading-relaxed space-y-2">
            <p>Gérez votre budget mensuel sur <strong>4 semaines</strong>.</p>
            <p>Revenu mensuel : <strong>3 200 $</strong>.</p>
            <p>Vos charges fixes (Loyer, Factures) sont prélevées automatiquement chaque semaine.</p>
            <p>Pour le reste, contrôlez vos dépenses. Évitez les dépassements de budget (-3 pts) et affrontez les imprévus de la vie.</p>
          </div>
          <button 
            onClick={() => setHasStarted(true)} 
            className="bg-green-main text-black px-8 py-4 font-black uppercase tracking-widest rounded-lg hover:bg-green-bright transition-all hover:scale-105"
          >
            Commencer le mois
          </button>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex justify-between items-center mb-6 pr-8">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase">Budget Manager</h2>
            <div className="text-xs md:text-sm font-bold bg-white/10 px-3 py-1 rounded text-white uppercase tracking-wider">Week {week} / 4</div>
          </div>

          {!gameOver ? (
            <div className="flex flex-col flex-1 overflow-hidden relative">
              {/* Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-[#1a1a1a] p-3 rounded border border-white/5">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Income</div>
                  <div className="text-lg font-bold text-white">$3200</div>
                </div>
                <div className="bg-[#1a1a1a] p-3 rounded border border-white/5">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Total Spent</div>
                  <div className="text-lg font-bold text-white">${totalSpent.toFixed(2)}</div>
                </div>
                <div className="bg-[#1a1a1a] p-3 rounded border border-white/5">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Remaining</div>
                  <div className={`text-lg font-bold ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>${remaining.toFixed(2)}</div>
                </div>
                <div className="bg-[#1a1a1a] p-3 rounded border border-white/5">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Score</div>
                  <div className={`text-lg font-bold flex items-center gap-2 ${badge.color}`}>
                    {score} <span className="text-[10px] uppercase border px-1 rounded">{badge.text}</span>
                  </div>
                </div>
              </div>

              {/* Event Modal Overlay */}
              {currentEvent && (
                <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center p-6 text-center rounded-lg">
                  <h3 className="text-2xl font-black text-white mb-2">{currentEvent.title}</h3>
                  <p className="text-white/60 mb-8">{currentEvent.desc}</p>
                  <div className="flex flex-col gap-3 w-full max-w-sm">
                    {currentEvent.choices.map((choice, i) => (
                      <button key={i} onClick={() => handleEventChoice(choice)} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 px-4 rounded transition-colors">
                        {choice.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="overflow-y-auto mb-4 flex-1 bg-[#1a1a1a] p-4 rounded border border-white/5">
                <div className="grid gap-4">
                  {BUDGET_CATEGORIES.map(cat => {
                    const currentSpent = spent[cat.id];
                    const progress = Math.min((currentSpent / cat.limit) * 100, 100);
                    let barColor = 'bg-green-500';
                    if (progress >= 100) barColor = 'bg-red-500';
                    else if (progress >= 80) barColor = 'bg-yellow-500';

                    return (
                      <div key={cat.id} className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <div className="w-full md:w-1/3">
                          <div className="flex justify-between text-xs font-bold text-white mb-1">
                            <span>{cat.name} {cat.fixed && '(Fixed)'}</span>
                            <span className={progress >= 100 ? 'text-red-500' : 'text-white'}>${currentSpent.toFixed(0)} / ${cat.limit}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full ${barColor}`} style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                        <div className="w-full md:w-auto flex gap-1">
                          {!cat.fixed && [10, 25, 50, 100].map(amt => (
                            <button key={amt} disabled={!!currentEvent} onClick={() => addSpend(cat.id, amt)} className="bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold px-2 py-1 rounded disabled:opacity-50 transition-colors">
                              +${amt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <button 
                  onClick={handleNextWeek} 
                  disabled={!!currentEvent}
                  className="bg-white text-black font-black uppercase tracking-widest px-8 py-3 rounded hover:bg-gray-200 transition-colors w-full md:w-auto shadow-lg disabled:opacity-50"
                >
                  {week === 4 ? 'Finish Month' : 'Next Week'}
                </button>
              </div>

              {/* Trade Log */}
              <div className="h-[100px] bg-black rounded border border-white/5 p-3 overflow-y-auto font-mono text-[10px] leading-relaxed">
                {logs.map((log, i) => (
                  <div key={i} className="mb-1">
                    <span className="text-white/30 mr-2">[Wk {log.week}]</span>
                    <span className={log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : log.type === 'warning' ? 'text-yellow-400' : 'text-white/60'}>
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
              <div className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">Month Completed</div>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                Final Score: {score}/100
              </h3>
              <div className="text-lg text-white/80 mb-2">Total Saved: <span className="font-bold text-green-400">${spent.savings.toFixed(2)}</span></div>
              <div className={`text-lg font-bold mb-8 ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                Remaining Balance: ${remaining.toFixed(2)}
              </div>
              <button 
                onClick={resetGame} 
                className="bg-white text-black px-8 py-3 font-black uppercase tracking-widest rounded hover:bg-gray-200 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const Gaming = () => {
  const { user } = useContext(AuthContext);
  const [activeGame, setActiveGame] = useState(null);
  const [quizState, setQuizState] = useState({ qIndex: 0, score: 0, finished: false });

  const handleQuizAnswer = (idx) => {
    const isCorrect = idx === QUIZ_QUESTIONS[quizState.qIndex].a;
    const newScore = isCorrect ? quizState.score + 50 : quizState.score;
    
    if (isCorrect) toast.success('+50 Points !');
    else toast.error('Mauvaise réponse !');

    if (quizState.qIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizState({ ...quizState, qIndex: quizState.qIndex + 1, score: newScore });
    } else {
      setQuizState({ ...quizState, finished: true, score: newScore });
      
      // Save points to localStorage
      if (user && newScore > 0) {
        // Unlock quiz defi
        const defis = getStorageItem(`mb_defis_${user.id}`, DEFAULT_DEFIS);
        const newDefis = defis.map(d => d.id === 5 ? { ...d, progress: 100 } : d);
        setStorageItem(`mb_defis_${user.id}`, newDefis);

        const pointsData = getStorageItem(`mb_points_${user.id}`, { points_total: 0, points_mois: 0, niveau: 'BRONZE' });
        const newTotal = pointsData.points_total + newScore;
        setStorageItem(`mb_points_${user.id}`, { ...pointsData, points_total: newTotal, points_mois: pointsData.points_mois + newScore });
        window.dispatchEvent(new Event('pointsUpdated'));
      }
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center py-16 px-4 md:px-8 relative overflow-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-main/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 mb-16"
      >
        <div >
          <br /><br /><br />
        </div>
        <h1 className="text-5xl md:text-7xl font-syne font-black text-white leading-tight">
          LIBÉREZ VOTRE<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-main to-green-bright">AVENTURE GAMING</span>
        </h1>
        <p className="mt-6 text-xl font-bold text-gold tracking-widest uppercase">
          EXPLOREZ LE PLAISIR SANS LIMITES!
        </p>
          <br/>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl z-10">
        {GAMES.map((game, idx) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            whileHover={!game.disabled ? { y: -10, scale: 1.02 } : {}}
            className={`bg-bg-card border border-border rounded-2xl p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden group ${game.disabled ? 'opacity-70' : 'hover:border-green-main/50 cursor-pointer'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-surface/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="mb-8 flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-green-main/10 border border-green-main/20 flex items-center justify-center shadow-[0_0_30px_rgba(157,253,36,0.1)] group-hover:bg-green-main/20 group-hover:scale-110 transition-all duration-300">
                {game.icon}
              </div>
            </div>
            
            <h3 className="text-2xl font-syne font-bold text-white mb-4 relative z-10">
              {game.title}
            </h3>
            
            <p className="text-text-muted mb-8 relative z-10 flex-grow">
              {game.desc}
            </p>
            
            <button 
              onClick={() => !game.disabled && setActiveGame(game.id)}
              disabled={game.disabled}
              className={`w-full py-3 font-bold rounded-lg relative z-10 transition-colors ${game.disabled ? 'bg-bg-surface text-gray-500 cursor-not-allowed' : 'bg-bg-surface border border-border group-hover:border-green-main text-white'}`}
            >
              {game.disabled ? 'BIENTÔT' : 'JOUER MAINTENANT'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {activeGame === 'quiz' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-bg-card border border-border rounded-2xl p-8 max-w-lg w-full relative"
            >
              <button 
                onClick={() => { setActiveGame(null); setQuizState({ qIndex: 0, score: 0, finished: false }); }} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              {!quizState.finished ? (
                <>
                  <div className="mb-8">
                    <span className="text-sm font-bold text-green-bright mb-2 block">Question {quizState.qIndex + 1}/{QUIZ_QUESTIONS.length}</span>
                    <h3 className="text-xl font-syne font-bold text-white">
                      {QUIZ_QUESTIONS[quizState.qIndex].q}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {QUIZ_QUESTIONS[quizState.qIndex].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        className="w-full text-left p-4 rounded-lg border border-border bg-bg-surface hover:border-green-main hover:bg-green-main/10 transition-colors text-sm"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-main/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-green-bright" />
                  </div>
                  <h3 className="text-3xl font-syne font-bold text-white mb-2">Quiz Terminé !</h3>
                  <p className="text-text-muted mb-6">Vous avez gagné un total de :</p>
                  <p className="text-5xl font-black text-gold mb-8">{quizState.score} Pts</p>
                  
                  <button 
                    onClick={() => { setActiveGame(null); setQuizState({ qIndex: 0, score: 0, finished: false }); }} 
                    className="w-full py-3 bg-green-main hover:bg-green-mid text-black font-bold rounded-lg shadow-lg"
                  >
                    Récupérer mes points
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {activeGame === 'trading' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <TradingSimulator onClose={() => setActiveGame(null)} user={user} />
          </div>
        )}

        {activeGame === 'simcity' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <BudgetManager onClose={() => setActiveGame(null)} user={user} />
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gaming;
