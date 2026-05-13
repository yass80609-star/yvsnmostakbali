import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, ArrowLeft, Sparkles, TrendingUp, ShieldCheck, Zap, MessageSquare, Square, Trash2, TrendingDown, PiggyBank, Building2, Coins, BarChart3, Wallet, BadgePercent, Landmark, Bitcoin, Home, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';

const SUGGESTIONS = [
  { text: "Comment investir avec 5000 DH ?", icon: <TrendingUp size={13} /> },
  { text: "Wach crypto halal ?", icon: <Bitcoin size={13} /> },
  { text: "Best ETF for beginners?", icon: <Zap size={13} /> },
  { text: "كيف أوفر للتقاعد؟", icon: <PiggyBank size={13} /> },
  { text: "C'est quoi la Bourse de Casablanca ?", icon: <Landmark size={13} /> },
  { text: "Investing in gold or stocks?", icon: <Coins size={13} /> },
  { text: "Comment gérer son budget mensuel ?", icon: <Wallet size={13} /> },
  { text: "What is compound interest?", icon: <BadgePercent size={13} /> },
  { text: "L'immobilier est-il un bon investissement ?", icon: <Home size={13} /> },
  { text: "Quelle banque marocaine recommandes-tu ?", icon: <Building2 size={13} /> },
  { text: "Wach l'or investissement mzyan ?", icon: <Coins size={13} /> },
  { text: "كيف أبدأ في الاستثمار؟", icon: <TrendingUp size={13} /> },
  { text: "Difference between stocks and bonds?", icon: <BarChart3 size={13} /> },
  { text: "Comment calculer mon épargne retraite ?", icon: <PiggyBank size={13} /> },
  { text: "Inflation impact on savings?", icon: <TrendingDown size={13} /> },
  { text: "Wach Attijariwafa bank mzyana?", icon: <Landmark size={13} /> },
];

const NON_FINANCE_KEYWORDS = [
  'recette', 'cuisine', 'cuisinier', 'sport', 'football', 'foot', 'music', 'musique', 'film', 'cinéma',
  'météo', 'weather', 'amour', 'love', 'santé', 'health', 'médecin', 'doctor', 'politique', 'politics',
  'religion', 'jeux', 'game', 'blague', 'joke', 'géographie', 'geography', 'chimie', 'physique',
  'voyage', 'travel', 'tourisme', 'mode', 'fashion', 'beauty', 'beauté', 'coding', 'programming', 'hack'
];

const NON_FINANCE_REPLIES = [
  "Je suis un expert en finance uniquement. Ce sujet dépasse mon domaine. Puis-je vous aider avec l'investissement ou l'épargne ?",
  "Ana khddam ghir f finance — had sujet machi mn domaine dyali. Wach tsa2al shi haja 3la l'argent ?",
  "I'm a finance specialist only. This topic is outside my expertise. Can I help you with investing or savings instead?",
  "أنا متخصص في المال والاستثمار فقط. هذا الموضوع خارج نطاق تخصصي."
];

function isNonFinance(text) {
  const lower = text.toLowerCase();
  return NON_FINANCE_KEYWORDS.some(kw => lower.includes(kw));
}

// Strip ALL markdown and special symbols before TTS
function cleanForSpeech(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')    // **bold**
    .replace(/\*(.+?)\*/g, '$1')         // *italic*
    .replace(/\*+/g, '')                 // stray asterisks
    .replace(/#+\s*/g, '')               // # headings
    .replace(/[-•–—]\s/g, '')           // bullet/dash
    .replace(/`{1,3}[^`]*`{1,3}/g, '')  // `code` / ```code```
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // [link](url)
    .replace(/[_~>|#\[\]{}\(\)]/g, '')  // other symbols
    .replace(/\s+/g, ' ')               // normalize spaces
    .trim();
}

// Bold formatter for display
const FormattedContent = ({ content }) => {
  const lines = content.split('\n');
  return (
    <span>
      {lines.map((line, lineIdx) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <span key={lineIdx}>
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-green-bright">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
            {lineIdx < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
};

const IaTool = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('ia_tool_history');
    return saved ? JSON.parse(saved) : [
      {
        role: 'ai',
        content: "Bienvenue ! Je suis votre assistant IA spécialisé en **finance**. Posez-moi vos questions sur l'investissement, l'épargne, les marchés et plus encore."
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);

  const scrollRef = useRef(null);
  const abortControllerRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastSpokenTextRef = useRef('');
  const autoSendRef = useRef(false);
  const transcriptRef = useRef('');

  useEffect(() => {
    localStorage.setItem('ia_tool_history', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ar-MA';
      recognitionRef.current.onresult = (e) => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
        setInput(transcript);
        transcriptRef.current = transcript;
      };
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (autoSendRef.current && transcriptRef.current.trim()) {
          handleSend(transcriptRef.current.trim());
          transcriptRef.current = '';
          setInput('');
        }
        autoSendRef.current = false;
      };
      recognitionRef.current.onerror = () => setIsRecording(false);
    }
  }, []);

  const toggleTTS = () => {
    if (isTTSEnabled) {
      window.speechSynthesis.cancel();
      setIsTTSEnabled(false);
    } else {
      setIsTTSEnabled(true);
      // Resume last spoken message
      if (lastSpokenTextRef.current) {
        const utterance = new SpeechSynthesisUtterance(lastSpokenTextRef.current);
        const t = lastSpokenTextRef.current;
        if (/[أ-ي]/.test(t)) utterance.lang = 'ar-SA';
        else if (/[a-zA-Z]{3,}/.test(t)) utterance.lang = 'en-US';
        else utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const speak = (text) => {
    if (!isTTSEnabled) return;
    window.speechSynthesis.cancel();
    const clean = cleanForSpeech(text);
    lastSpokenTextRef.current = clean; // save for resume on unmute
    const utterance = new SpeechSynthesisUtterance(clean);
    if (/[أ-ي]/.test(clean)) utterance.lang = 'ar-SA';
    else if (/[a-zA-Z]{3,}/.test(clean)) utterance.lang = 'en-US';
    else utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      autoSendRef.current = true;
      recognitionRef.current.stop();
    } else {
      transcriptRef.current = '';
      setInput('');
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async (text = input) => {
    const messageToSend = (text || input).trim();
    if (!messageToSend || isLoading) return;

    const userMessage = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Quick client-side rejection for non-finance topics
    if (isNonFinance(messageToSend)) {
      await new Promise(r => setTimeout(r, 350));
      const reply = NON_FINANCE_REPLIES[Math.floor(Math.random() * NON_FINANCE_REPLIES.length)];
      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
      speak(reply);
      setIsLoading(false);
      return;
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('http://localhost:5000/api/finance-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          message: messageToSend,
          history: messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }))
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      speak(data.reply);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: "Difficulté technique. Veuillez réessayer dans quelques instants."
        }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    window.speechSynthesis.cancel();
    setIsLoading(false);
  };

  const clearHistory = () => {
    const initial = [{
      role: 'ai',
      content: "Bienvenue ! Je suis votre assistant IA spécialisé en **finance**. Comment puis-je vous aider aujourd'hui ?"
    }];
    setMessages(initial);
    localStorage.setItem('ia_tool_history', JSON.stringify(initial));
  };

  return (
    <div className="min-h-screen bg-bg-primary text-white font-sans">
      {/* Ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-main/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-bright/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-8 flex flex-col" style={{ minHeight: 'calc(100vh - 80px)' }}>

        {/* ── HERO HEADER ─────────────────────────────────────── */}
        <div className="pt-8 pb-6">
          <div className="flex justify-between items-start mb-8">
            <Link to="/" className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mt-1">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-main/20 transition-all">
                <ArrowLeft size={14} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Retour</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTTS}
                className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors mt-1 px-3 py-1.5 rounded-full border ${
                  isTTSEnabled
                    ? 'text-green-main border-green-main/30 hover:bg-green-main/10'
                    : 'text-white/30 border-white/10 hover:text-white'
                }`}
                title={isTTSEnabled ? 'Couper le son' : 'Activer le son'}
              >
                {isTTSEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                {isTTSEnabled ? 'Son actif' : 'Muet'}
              </button>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors mt-1"
              >
                <Trash2 size={12} />
                Effacer
              </button>
            </div>
          </div>

          {/* Big Title */}
          <div className="mb-6 text-center">
            <h1 className="font-syne font-black leading-none tracking-tighter mb-1">
              <span className="block text-5xl md:text-7xl text-white">Agent</span>
              <span className="block text-5xl md:text-7xl text-green-main italic">IA.</span>
            </h1>
            <p className="text-text-muted text-sm md:text-base max-w-xl mt-4 leading-relaxed font-medium mx-auto">
              Découvrez la nouvelle génération de gestion financière. Analysez les tendances avec l'IA, gérez vos actifs en toute sécurité et maîtrisez les marchés.
            </p>
          </div>
        </div>

        {/* ── CHAT CONTAINER ──────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-bg-card border border-border rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: '60vh' }}>

          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-bg-surface/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-main flex items-center justify-center shadow-[0_0_15px_rgba(0,200,83,0.3)]">
                <Sparkles size={16} className="text-black" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-white">IA Financial Tool</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-main animate-pulse" />
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">En ligne</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest hidden md:block">
              Finance · Investissement · Épargne
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6" style={{ maxHeight: '55vh' }}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-1 ${
                    msg.role === 'user' ? 'bg-green-main/20 border border-green-main/30' : 'bg-white/5 border border-white/10'
                  }`}>
                    {msg.role === 'user' ? <User size={13} className="text-green-main" /> : <Bot size={13} className="text-white/60" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-green-main text-black font-semibold rounded-tr-none'
                      : 'bg-white/[0.06] border border-white/10 text-white/90 rounded-tl-none'
                  }`}>
                    <FormattedContent content={msg.content} />
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mt-1">
                    <Bot size={13} className="text-white/60" />
                  </div>
                  <div className="bg-white/[0.06] border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-green-main rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-green-main rounded-full animate-bounce [animation-delay:0.15s]" />
                      <div className="w-1.5 h-1.5 bg-green-main rounded-full animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Suggestions scrollable row */}
          <div className="px-4 py-3 border-t border-border/50 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 w-max">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.text)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap hover:bg-green-main/10 hover:border-green-main/30 hover:text-green-bright transition-all disabled:opacity-40 flex-shrink-0"
                >
                  <span className="text-green-main">{s.icon}</span>
                  {s.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 py-4 border-t border-border bg-bg-surface/30">
            <div className="flex items-center gap-2 bg-black/40 border border-border rounded-2xl px-3 py-2 focus-within:border-green-main/50 transition-all">
              {/* Mic button */}
              <button
                onClick={toggleRecording}
                className={`p-2 rounded-xl flex-shrink-0 transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'hover:bg-white/10 text-text-muted hover:text-white'
                }`}
                title={isRecording ? 'Arrêter le micro' : 'Parler'}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Posez votre question financière..."
                disabled={isLoading && !isRecording}
                className="flex-grow bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/20 py-1 disabled:opacity-50"
              />

              {isLoading ? (
                <button
                  onClick={handleStop}
                  className="p-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all flex-shrink-0"
                  title="Arrêter la génération"
                >
                  <Square size={16} />
                </button>
              ) : (
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-2 bg-green-main text-black rounded-xl hover:bg-green-bright transition-all disabled:opacity-30 flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
            <p className="text-center text-[9px] text-white/15 uppercase tracking-widest mt-2 font-bold">
              IA spécialisée Finance · Investissement · Épargne · Marchés
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IaTool;
