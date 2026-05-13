import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Mic, MicOff, Volume2, VolumeX, X, Sparkles, Square } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SUGGESTED_QUESTIONS = [
  "Comment investir avec 5000 DH ?",
  "Wach crypto halal ?",
  "What is the best ETF for beginners?",
  "كيف أوفر للتقاعد؟"
];

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

const AIWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const abortRef = useRef(null);
  const lastSpokenTextRef = useRef('');
  const currentUtteranceRef = useRef(null);
  const autoSendRef = useRef(false); // true when stopping recording should auto-send
  const transcriptRef = useRef(''); // holds latest transcript

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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
        transcriptRef.current = transcript; // keep ref in sync
      };
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        // If user clicked mic to stop → auto-send
        if (autoSendRef.current && transcriptRef.current.trim()) {
          handleSend(transcriptRef.current.trim());
          transcriptRef.current = '';
          setInput('');
        }
        autoSendRef.current = false;
      };
      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        toast.error("Erreur micro");
      };
    }
  }, []);

  // Stop TTS immediately when muted; resume last message when unmuted
  const toggleTTS = () => {
    if (isTTSEnabled) {
      window.speechSynthesis.cancel();
      setIsTTSEnabled(false);
    } else {
      setIsTTSEnabled(true);
      // Resume last spoken text
      if (lastSpokenTextRef.current) {
        const utterance = new SpeechSynthesisUtterance(lastSpokenTextRef.current);
        const text = lastSpokenTextRef.current;
        if (/[أ-ي]/.test(text)) utterance.lang = 'ar-SA';
        else if (/[a-zA-Z]{3,}/.test(text)) utterance.lang = 'en-US';
        else utterance.lang = 'fr-FR';
        currentUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const speak = (text) => {
    if (!isTTSEnabled) return;
    window.speechSynthesis.cancel();
    const clean = cleanForSpeech(text);
    lastSpokenTextRef.current = clean; // save for resume
    const utterance = new SpeechSynthesisUtterance(clean);
    if (/[أ-ي]/.test(clean)) utterance.lang = 'ar-SA';
    else if (/[a-zA-Z]{3,}/.test(clean)) utterance.lang = 'en-US';
    else utterance.lang = 'fr-FR';
    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Micro non supporté");
      return;
    }
    if (isRecording) {
      // Stop and auto-send the transcript
      autoSendRef.current = true;
      recognitionRef.current.stop();
    } else {
      transcriptRef.current = '';
      setInput('');
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || isTyping) return;

    const userMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowDisclaimer(false);

    abortRef.current = new AbortController();

    try {
      const response = await axios.post('http://localhost:5000/api/finance-ai', {
        message: textToSend,
        history: messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
      }, { signal: abortRef.current.signal });

      const reply = response.data.reply;
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      speak(reply);
    } catch (error) {
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        toast.error("Erreur de connexion");
      }
    } finally {
      setIsTyping(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    window.speechSynthesis.cancel();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[380px] h-[580px] bg-bg-card border border-border rounded-2xl flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-bg-surface flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-main flex items-center justify-center shadow-[0_0_15px_rgba(0,200,83,0.3)]">
                  <Sparkles className="text-black w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-syne font-black text-[12px] uppercase tracking-widest">IA Financial Tool</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-main animate-pulse" />
                    <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">En ligne</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTTS}
                  className={`p-1.5 rounded-lg transition-colors ${isTTSEnabled ? 'text-green-main hover:bg-green-main/10' : 'text-text-muted hover:bg-white/10'}`}
                  title={isTTSEnabled ? 'Couper le son' : 'Activer le son'}
                >
                  {isTTSEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-text-muted hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-3">
              {showDisclaimer && messages.length === 0 && (
                <div className="bg-green-main/5 border border-green-main/20 rounded-xl p-3 mb-2">
                  <p className="text-[10px] text-green-bright/80 leading-relaxed text-center italic">
                    ⚠️ Assistant informatif uniquement. Consultez un professionnel avant toute décision financière.
                  </p>
                </div>
              )}

              {messages.length === 0 && (
                <div className="space-y-3 mt-2">
                  <p className="text-sm text-white/70 text-center mb-4">Comment puis-je vous aider ?</p>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="w-full text-left text-xs p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-green-main/10 hover:border-green-main/30 transition-all text-text-muted hover:text-white"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-green-main text-black font-semibold rounded-tr-none'
                      : 'bg-white/[0.06] border border-white/10 text-text-primary rounded-tl-none'
                  }`}>
                    <FormattedContent content={m.content} />
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.06] border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-green-main rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-green-main rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 bg-green-main rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border bg-bg-surface">
              <div className="flex items-center gap-2 bg-black/40 border border-border rounded-xl p-1.5 focus-within:border-green-main/40 transition-all">
                <button
                  onClick={toggleRecording}
                  className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'hover:bg-white/10 text-text-muted hover:text-white'
                  }`}
                  title={isRecording ? 'Arrêter' : 'Parler'}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Votre question financière..."
                  className="flex-grow bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/20 py-1"
                />

                {isTyping ? (
                  <button
                    onClick={handleStop}
                    className="p-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex-shrink-0"
                    title="Arrêter"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="p-2 bg-green-main hover:bg-green-bright text-black rounded-lg transition-all disabled:opacity-30 flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-green-main rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,200,83,0.4)] hover:shadow-[0_0_30px_rgba(0,200,83,0.6)] transition-all group"
          >
            <MessageSquare className="text-black w-6 h-6 group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIWidget;
