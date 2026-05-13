import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { useNews } from '../hooks/useNews';
import NewsCard from '../components/NewsCard';
import { BookOpen, Star, PlayCircle, CheckCircle, X, Award, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const COURSES = [
  { 
    id: 'debutant', title: 'Gestion du Budget', level: 'DÉBUTANT', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80', content: 'Apprenez à gérer vos revenus et dépenses quotidiens.',
    lessons: [
      { title: "Définition d'un budget", text: "Un budget est un plan financier qui estime vos revenus et vos dépenses sur une période donnée. Il vous permet de savoir exactement où va votre argent et d'éviter de dépenser plus que ce que vous gagnez." },
      { title: "La règle du 50/30/20", text: "Cette règle simple recommande d'allouer 50% de vos revenus aux besoins essentiels (loyer, nourriture), 30% aux envies (loisirs, sorties) et 20% à l'épargne et au remboursement de dettes." },
      { title: "Le suivi des dépenses", text: "Pour bien gérer un budget, il faut noter chaque dépense. Cela permet d'identifier les 'dépenses fantômes' (abonnements inutilisés, petits cafés quotidiens) et de les réduire." },
      { title: "Le Fonds d'urgence", text: "Avant tout investissement, vous devez constituer une épargne de précaution équivalente à 3 à 6 mois de dépenses courantes. Elle vous protège en cas d'imprévu (perte d'emploi, réparation urgente)." }
    ]
  },
  { 
    id: 'intermediaire', title: 'Analyse Financière', level: 'INTERMÉDIAIRE', image: 'https://i.pinimg.com/1200x/b6/71/6a/b6716aeb4d28424f6cf24886aa46724c.jpg', content: 'Comprendre les bilans, les taux d\'intérêt et l\'inflation.',
    lessons: [
      { title: "Qu'est-ce que l'Inflation ?", text: "L'inflation est la perte du pouvoir d'achat de la monnaie qui se traduit par une augmentation générale et durable des prix. Votre argent perd de sa valeur s'il n'est pas investi à un taux supérieur à l'inflation." },
      { title: "Les Taux d'intérêt composés", text: "C'est la huitième merveille du monde. Les intérêts composés signifient que vos intérêts génèrent eux-mêmes des intérêts. Plus vous commencez tôt, plus l'effet exponentiel est puissant." },
      { title: "Le Bilan Personnel", text: "Un bilan personnel liste vos Actifs (ce que vous possédez : cash, maison, actions) et vos Passifs (ce que vous devez : crédits). Votre Valeur Nette = Actifs - Passifs." }
    ]
  },
  { 
    id: 'avance', title: 'Gestion Portefeuille', level: 'AVANCÉ', image: 'https://i.pinimg.com/1200x/bc/d5/e1/bcd5e186d2c6bf0bb3d5fb933ce62c37.jpg', content: 'Diversification, gestion des risques et actifs financiers.',
    lessons: [
      { title: "Les Actions vs Obligations", text: "Une action est une part de propriété dans une entreprise (plus risqué, rendement potentiel élevé). Une obligation est un prêt que vous faites à une entreprise ou un état (moins risqué, rendement fixe et plus faible)." },
      { title: "La Diversification", text: "Ne pas mettre tous ses œufs dans le même panier. Diversifier consiste à investir dans différents secteurs, zones géographiques et types d'actifs pour réduire le risque global du portefeuille." },
      { title: "Les ETF (Trackers)", text: "Un ETF est un fonds d'investissement qui réplique la performance d'un indice (comme le S&P 500 ou le MASI). C'est un moyen simple et peu coûteux d'obtenir une diversification instantanée." }
    ]
  },
  { 
    id: 'expert', title: 'Stratégies Investissement', level: 'EXPERT', image: 'https://i.pinimg.com/1200x/99/fa/aa/99faaa936ed7913f648947cab8c944df.jpg', content: 'Trading algorithmique, produits dérivés et macro-économie.',
    lessons: [
      { title: "Macro-économie", text: "Comprendre comment les décisions des banques centrales (taux directeurs) influencent les marchés boursiers et obligataires." },
      { title: "Analyse Fondamentale", text: "Évaluer la valeur intrinsèque d'une entreprise en étudiant ses états financiers, ses avantages concurrentiels et son équipe dirigeante." },
      { title: "Produits Dérivés", text: "Utilisation d'options et de futures pour couvrir son portefeuille contre les risques de marché ou pour spéculer avec un effet de levier." }
    ]
  },
  { 
    id: 'immobilier', title: 'Investissement Immobilier', level: 'AVANCÉ', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80', content: 'LMNP, investissement locatif et financement.',
    lessons: [
      { title: "L'effet de Levier", text: "L'immobilier est le seul actif qu'on peut acheter avec l'argent de la banque. Le but est que le loyer couvre le crédit." },
      { title: "Calcul de Rendement", text: "Savoir calculer un rendement brut vs net vs net-net (après impôts)." },
      { title: "La Fiscalité Immobilière", text: "Choisir entre le régime micro-foncier et le régime réel pour optimiser ses impôts." }
    ]
  },
  { 
    id: 'crypto', title: 'Cryptomonnaies & Web3', level: 'INTERMÉDIAIRE', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&q=80', content: 'Bitcoin, Ethereum et la DeFi.',
    lessons: [
      { title: "Blockchain 101", text: "Comprendre le registre décentralisé et immuable qui sécurise les transactions sans tiers de confiance." },
      { title: "Bitcoin vs Altcoins", text: "Pourquoi le Bitcoin est considéré comme l'or numérique et le rôle des autres protocoles." },
      { title: "Sécuriser ses Actifs", text: "L'importance des cold wallets (Ledger) et la gestion des clés privées." }
    ]
  },
  { 
    id: 'psychologie', title: 'Psychologie de l\'Argent', level: 'DÉBUTANT', image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=400&q=80', content: 'Biais cognitifs et discipline financière.',
    lessons: [
      { title: "Le FOMO", text: "Apprendre à ne pas céder à la peur de rater une opportunité et à rester discipliné." },
      { title: "Horizon de Temps", text: "Pourquoi le temps est votre meilleur allié en finance." },
      { title: "Biais de Confirmation", text: "Savoir remettre en question ses propres croyances pour mieux investir." }
    ]
  },
  { 
    id: 'fiscalite', title: 'Fiscalité & Patrimoine', level: 'AVANCÉ', image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?w=400&q=80', content: 'Optimisation fiscale, succession et régimes matrimoniaux.',
    lessons: [
      { title: "Optimisation Fiscale", text: "Comprendre les niches fiscales légales pour réduire son imposition sur le revenu et le capital." },
      { title: "Transmission de Patrimoine", text: "Comment préparer sa succession pour protéger ses proches et minimiser les droits de mutation." },
      { title: "Assurance Vie", text: "Le couteau suisse de l'épargnant : fiscalité avantageuse et outil de transmission puissant." }
    ]
  }
];

const TEST_QUESTIONS = [
  { question: "Qu'est-ce qu'un budget ?", options: ["Une prévision des revenus et dépenses", "Un compte bancaire", "Une taxe", "Un prêt"], answer: 0 },
  { question: "Qu'est-ce que l'inflation ?", options: ["Une augmentation générale des prix", "La baisse des prix", "Un type d'investissement", "Une aide de l'état"], answer: 0 },
  { question: "L'épargne de précaution sert à :", options: ["Acheter une voiture de luxe", "Faire face aux imprévus financiers", "Spéculer en bourse", "Payer ses impôts"], answer: 1 },
  { question: "Qu'est-ce qu'une action en bourse ?", options: ["Une part du capital d'une entreprise", "Une dette de l'entreprise", "Un compte d'épargne", "Une obligation d'état"], answer: 0 },
  { question: "Qu'est-ce que la diversification ?", options: ["Mettre tout son argent sur une action", "Répartir ses investissements pour réduire le risque", "Acheter uniquement de l'or", "Garder tout en espèces"], answer: 1 },
  { question: "Qu'est-ce qu'une obligation ?", options: ["Une part d'entreprise", "Un titre de créance (prêt) avec intérêts", "Une cryptomonnaie", "Une assurance vie"], answer: 1 },
  { question: "L'intérêt composé c'est :", options: ["Des intérêts calculés seulement sur le capital", "Des intérêts calculés sur le capital ET les intérêts précédents", "Une pénalité bancaire", "Un taux fixe"], answer: 1 },
  { question: "Qu'est-ce qu'un OPCVM ?", options: ["Un organisme de placement collectif en valeurs mobilières", "Un compte chèque", "Une devise étrangère", "Un impôt sur le revenu"], answer: 0 },
  { question: "Le risque de volatilité concerne principalement :", options: ["Les livrets d'épargne", "Le marché des actions et cryptomonnaies", "Les obligations d'état", "Les comptes courants"], answer: 1 },
  { question: "Un ETF (Tracker) a pour but de :", options: ["Garantir le capital", "Répliquer la performance d'un indice boursier", "Offrir un taux fixe", "Financer uniquement l'immobilier"], answer: 1 }
];

const Academy = () => {
  const { user } = useContext(AuthContext);
  const [progress, setProgress] = useState({}); // Stocke l'index de la leçon actuelle
  const [userLevel, setUserLevel] = useState(null);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const { articles, loading } = useNews('education+financiere+maroc');
  
  const [activeLessonModal, setActiveLessonModal] = useState({ isOpen: false, courseId: null });

  useEffect(() => {
    if (user) {
      const storedProgress = getStorageItem(`mb_course_idx_${user.id}`, { debutant: 0, intermediaire: 0, avance: 0, expert: 0 });
      setProgress(storedProgress);
      const storedLevel = getStorageItem(`mb_level_${user.id}`, null);
      setUserLevel(storedLevel);
    }
  }, [user]);

  const handleContinueCourse = (courseId) => {
    setActiveLessonModal({ isOpen: true, courseId });
  };

  const handleFinishLesson = () => {
    const courseId = activeLessonModal.courseId;
    const course = COURSES.find(c => c.id === courseId);
    const currentIdx = progress[courseId] || 0;
    
    if (currentIdx < course.lessons.length) {
      const newIdx = currentIdx + 1;
      const updated = { ...progress, [courseId]: newIdx };
      setProgress(updated);
      let newTotalPoints = 0;
      if (user) {
        setStorageItem(`mb_course_idx_${user.id}`, updated);
        
        // Add some points to the gamification system
        const pointsData = getStorageItem(`mb_points_${user.id}`, { points_total: 0, points_mois: 0, niveau: 'BRONZE' });
        const newPoints = pointsData.points_total + 20; // 20 points per lesson
        newTotalPoints = newPoints;
        setStorageItem(`mb_points_${user.id}`, { ...pointsData, points_total: newPoints, points_mois: pointsData.points_mois + 20 });
        window.dispatchEvent(new Event('pointsUpdated'));
      }
      
      if (newIdx >= course.lessons.length) {
        toast.success(`Les leçons sont terminées, votre somme totale est : ${newTotalPoints}`);
        setActiveLessonModal({ isOpen: false, courseId: null });
      }
    }
  };

  const handleAnswer = (selectedIdx) => {
    if (selectedIdx === TEST_QUESTIONS[currentQuestion].answer) {
      setScore(score + 1);
    }
    
    if (currentQuestion < TEST_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalScore = selectedIdx === TEST_QUESTIONS[currentQuestion].answer ? score + 1 : score;
      let calculatedLevel = 'DÉBUTANT';
      if (finalScore >= 5 && finalScore <= 7) calculatedLevel = 'INTERMÉDIAIRE';
      if (finalScore >= 8 && finalScore <= 9) calculatedLevel = 'AVANCÉ';
      if (finalScore === 10) calculatedLevel = 'EXPERT';

      setUserLevel(calculatedLevel);
      if (user) {
        setStorageItem(`mb_level_${user.id}`, calculatedLevel);
      }
      
      toast.success(`Test terminé ! Score: ${finalScore}/10. Votre niveau est : ${calculatedLevel}`);
      setIsTestOpen(false);
      setCurrentQuestion(0);
      setScore(0);
    }
  };

  const displayedCourses = COURSES.filter(course => {
    if (!userLevel) return true;
    return course.level === userLevel;
  });

  return (
    <div className="min-h-screen pt-4 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* HERO ACADEMY */}
      <div className="bg-bg-card border border-border rounded-2xl p-8 md:p-12 mb-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-main/10 rounded-full blur-3xl" />
        
        <div className="z-10 max-w-2xl">
          <div className="flex items-center space-x-2 text-gold mb-4">
            <Star fill="currentColor" size={20} />
            <Star fill="currentColor" size={20} />
            <Star fill="currentColor" size={20} />
            <Star fill="currentColor" size={20} />
            <Star fill="currentColor" size={20} className="opacity-50" />
            <span className="text-white ml-2 text-sm font-bold">4.9/5 — 1.2K+ étudiants</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-syne font-extrabold text-white mb-4">
            MOUSTAKBALI Academy
            <span className="block text-green-bright text-2xl mt-2">ÉTUDIER Finance</span>
          </h1>
          
          <p className="text-text-muted text-lg mb-8">
            Apprenez les bases de la finance, maîtrisez les stratégies d'investissement et prenez le contrôle de votre avenir financier.
          </p>
          
          {userLevel && (
            <div className="inline-flex items-center px-4 py-2 bg-green-main/20 border border-green-main text-green-bright rounded-lg font-bold mb-6">
              <Award className="mr-2" />
              Niveau : {userLevel}
            </div>
          )}
        </div>
        
        <div className="hidden md:flex flex-col space-y-4 z-10 mt-8 md:mt-0">
          <div className="bg-bg-surface border border-border p-6 rounded-xl flex items-center space-x-4 shadow-lg">
            <div className="w-12 h-12 bg-green-main/20 rounded-full flex items-center justify-center text-green-bright">
              {userLevel ? <Award size={24} /> : <CheckCircle size={24} />}
            </div>
            <div>
              <p className="font-bold">{userLevel ? 'Niveau Évalué' : 'Test de positionnement'}</p>
              <button 
                onClick={() => setIsTestOpen(true)}
                className="text-sm text-green-bright hover:underline mt-1"
              >
                {userLevel ? 'Refaire le test →' : 'Commencer le test →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TEST MODAL */}
      <AnimatePresence>
        {isTestOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-bg-card border border-border rounded-2xl p-8 max-w-lg w-full relative"
            >
              <button onClick={() => setIsTestOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X size={24} />
              </button>
              
              <div className="mb-8">
                <span className="text-sm font-bold text-green-bright mb-2 block">Question {currentQuestion + 1}/{TEST_QUESTIONS.length}</span>
                <h3 className="text-xl font-syne font-bold text-white">
                  {TEST_QUESTIONS[currentQuestion].question}
                </h3>
              </div>

              <div className="space-y-3">
                {TEST_QUESTIONS[currentQuestion].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="w-full text-left p-4 rounded-lg border border-border bg-bg-surface hover:border-green-main hover:bg-green-main/10 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LESSON MODAL */}
      <AnimatePresence>
        {activeLessonModal.isOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-bg-card border border-border rounded-2xl max-w-3xl w-full relative flex flex-col h-[80vh] shadow-2xl"
            >
              <button onClick={() => setActiveLessonModal({ isOpen: false, courseId: null })} className="absolute top-6 right-6 text-gray-400 hover:text-white z-10">
                <X size={24} />
              </button>

              {(() => {
                const course = COURSES.find(c => c.id === activeLessonModal.courseId);
                const currentIdx = progress[course.id] || 0;
                
                if (currentIdx >= course.lessons.length) {
                  return (
                    <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                      <div className="w-24 h-24 bg-green-main/20 rounded-full flex items-center justify-center mb-6">
                        <Award size={48} className="text-green-bright" />
                      </div>
                      <h2 className="text-3xl font-syne font-bold text-white mb-4">Cours Terminé !</h2>
                      <p className="text-text-muted mb-8">Vous avez validé toutes les leçons de ce cours.</p>
                      <button onClick={() => setActiveLessonModal({ isOpen: false, courseId: null })} className="px-8 py-3 bg-green-main hover:bg-green-mid text-black font-bold rounded-lg transition-colors">
                        Retour à l'Academy
                      </button>
                    </div>
                  );
                }

                const lesson = course.lessons[currentIdx];
                const pct = Math.round(((currentIdx) / course.lessons.length) * 100);

                return (
                  <>
                    <div className="p-8 border-b border-border bg-bg-surface rounded-t-2xl">
                      <span className="text-xs font-bold text-green-bright uppercase tracking-widest mb-2 block">{course.title} • Partie {currentIdx + 1}/{course.lessons.length}</span>
                      <h2 className="text-3xl font-syne font-bold text-white">{lesson.title}</h2>
                      
                      <div className="mt-6 flex items-center justify-between text-xs text-text-muted mb-2">
                        <span>Progression Globale</span>
                        <span className="font-bold text-white">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-bg-card rounded-full overflow-hidden">
                        <div className="h-full bg-green-main transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    
                    <div className="p-8 flex-1 overflow-y-auto">
                      <div className="prose prose-invert max-w-none text-text-muted text-lg leading-relaxed">
                        <p>{lesson.text}</p>
                      </div>
                    </div>
                    
                    <div className="p-6 border-t border-border bg-bg-surface rounded-b-2xl flex justify-end">
                      <button 
                        onClick={handleFinishLesson}
                        className="px-6 py-3 bg-green-main hover:bg-green-mid text-black font-bold rounded-lg transition-colors flex items-center"
                      >
                        J'ai compris, passer à la suite <PlayCircle size={20} className="ml-2" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COURSES */}
      <h2 className="text-2xl font-syne font-bold mb-6 flex items-center">
        <span className="w-2 h-8 bg-green-main rounded mr-3"></span>
        Vos Parcours d'Apprentissage
      </h2>
      
      {!userLevel && (
        <div className="bg-alert-red/10 border border-alert-red/30 p-4 rounded-lg mb-6 text-alert-red text-sm flex items-center">
           Passez le test de positionnement pour débloquer des cours adaptés à votre niveau.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {displayedCourses.map((course, idx) => {
          const currentIdx = progress[course.id] || 0;
          const courseProgress = Math.round((currentIdx / course.lessons.length) * 100);
          const isLocked = course.level === 'EXPERT' && user?.plan !== 'premium';

          return (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-bg-card border rounded-xl flex flex-col overflow-hidden shadow-lg transition-colors ${
                isLocked ? 'border-gray-800 opacity-75 grayscale' : 'border-border hover:border-green-main/50'
              }`}
            >
              <div className="h-40 overflow-hidden relative group">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-main/80 via-green-main/20 to-transparent mix-blend-color" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
                
                <div className="absolute top-2 left-2 flex items-center space-x-2 z-10">
                  <span className="text-xs font-bold text-black bg-green-main px-2 py-1 rounded tracking-wider shadow-md">
                    {course.level}
                  </span>
                  {isLocked && (
                    <span className="text-xs font-bold text-bg-surface bg-gold px-2 py-1 rounded tracking-wider shadow-md flex items-center">
                      <Lock size={12} className="mr-1" /> PREMIUM
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-syne font-bold text-white">{course.title}</h3>
                  <div className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center border border-border text-xs text-text-muted">
                    {course.lessons.length}P
                  </div>
                </div>
                
                <p className="text-sm text-text-muted mb-6 flex-1">
                  {course.content}
                </p>
                
                <div className="mt-auto">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-text-muted">Progression</span>
                    <span className="font-bold text-green-bright">{courseProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg-surface rounded-full overflow-hidden mb-4">
                    <div 
                      className={`h-full transition-all duration-500 ${isLocked ? 'bg-gray-600' : 'bg-green-main'}`}
                      style={{ width: `${courseProgress}%` }}
                    />
                  </div>
                  
                  {isLocked ? (
                    <button 
                      disabled
                      className="w-full py-2 bg-gray-800 text-gray-400 cursor-not-allowed rounded border border-gray-700 text-sm font-bold flex items-center justify-center"
                    >
                      <Lock size={16} className="mr-2" /> Réservé Premium
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleContinueCourse(course.id)}
                      className="w-full py-2 bg-bg-surface hover:bg-green-main/20 text-white rounded border border-border hover:border-green-main/50 transition-all text-sm font-bold flex items-center justify-center"
                    >
                      {courseProgress >= 100 ? 'Terminé' : 'Continuer'} <PlayCircle size={16} className="ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ARTICLES / RESOURCES */}
      <h2 className="text-2xl font-syne font-bold mb-6 flex items-center">
        <span className="w-2 h-8 bg-green-main rounded mr-3"></span>
        Ressources Éducatives
      </h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-bg-card animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article, i) => (
            <NewsCard key={i} article={article} />
          ))}
        </div>
      )}
      
    </div>
  );
};

export default Academy;
