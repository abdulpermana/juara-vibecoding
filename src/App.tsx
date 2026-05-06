import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Copy, 
  RefreshCw, 
  Ghost, 
  MessageSquare, 
  Sparkles, 
  Check,
  ChevronRight,
  Smile,
  Briefcase,
  Zap,
  Gem,
  Laugh
} from 'lucide-react';
import { generateReplies, type StyleType } from './services/gemini';
import { cn } from './lib/utils';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  style?: StyleType;
}

const STYLES: { label: StyleType; icon: any; color: string; description: string }[] = [
  { label: 'Friendly', icon: Smile, color: 'text-emerald-400', description: 'Warm & empathetic' },
  { label: 'Professional', icon: Briefcase, color: 'text-blue-400', description: 'Formal & concise' },
  { label: 'Gen Z', icon: Zap, color: 'text-yellow-400', description: 'Lowkey no cap' },
  { label: 'Luxury Brand', icon: Gem, color: 'text-purple-400', description: 'Elite & elegant' },
  { label: 'Funny', icon: Laugh, color: 'text-pink-400', description: 'Witty & playful' },
];

export default function App() {
  const [input, setInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StyleType>('Friendly');
  const [replies, setReplies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    setReplies([]);
    
    try {
      const results = await generateReplies(input, selectedStyle);
      setReplies(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <header className="flex flex-col items-center mb-12 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-purple-500/20"
          >
            <Ghost className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400"
          >
            GhostReply
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 max-w-sm"
          >
            Ghostwrite the perfect response for any customer interaction in seconds.
          </motion.p>
        </header>

        {/* Input Section */}
        <main className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 ml-1">
              <MessageSquare className="w-4 h-4" />
              <span>Customer Message</span>
            </div>
            <div className="relative group">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste the customer's message here..."
                className="w-full h-40 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none placeholder:text-zinc-600 text-zinc-200"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none group-focus-within:opacity-100 opacity-0 transition-opacity" />
            </div>
          </section>

          {/* Style Selector */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 ml-1">
              <Sparkles className="w-4 h-4" />
              <span>Response Style</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {STYLES.map((style) => (
                <button
                  key={style.label}
                  onClick={() => setSelectedStyle(style.label)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all gap-2 group",
                    selectedStyle === style.label
                      ? "bg-purple-500/10 border-purple-500/50 ring-1 ring-purple-500/50 shadow-lg shadow-purple-500/10"
                      : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
                  )}
                >
                  <style.icon className={cn("w-5 h-5", selectedStyle === style.label ? style.color : "text-zinc-500 group-hover:text-zinc-400")} />
                  <span className={cn(
                    "text-[10px] uppercase tracking-wider font-bold",
                    selectedStyle === style.label ? "text-purple-300" : "text-zinc-500 group-hover:text-zinc-400"
                  )}>
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!input.trim() || isLoading}
            className={cn(
              "w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all relative overflow-hidden group",
              !input.trim() || isLoading
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                : "bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            )}
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Ghost It</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
            {/* Reflective shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
          </button>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 pt-4"
              >
                <div className="flex items-center gap-3 text-sm text-zinc-500 ml-1">
                  <div className="flex gap-1">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  </div>
                  <span>Ghost is thinking...</span>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl animate-pulse" />
                ))}
              </motion.div>
            ) : replies.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-4"
              >
                 <div className="flex items-center justify-between ml-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Ghosted Suggestions</span>
                  </div>
                  <button 
                    onClick={handleGenerate}
                    className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>

                <div className="space-y-4">
                  {replies.map((reply, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative"
                    >
                      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700/80 transition-all hover:bg-zinc-900/80">
                        <p className="text-zinc-300 leading-relaxed pr-8">{reply}</p>
                        
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => copyToClipboard(reply, idx)}
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              copiedIndex === idx 
                                ? "bg-emerald-500/20 text-emerald-400" 
                                : "bg-zinc-800 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-white"
                            )}
                          >
                            {copiedIndex === idx ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Style Indicator */}
                        <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between">
                          <span className="text-[10px] text-zinc-600 font-medium px-2 py-0.5 rounded-full bg-zinc-800/50 capitalize">
                            Variant {idx + 1}
                          </span>
                          <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                            {selectedStyle} Style
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>

        <footer className="mt-20 text-center border-t border-zinc-900 pt-8">
           <p className="text-zinc-600 text-xs flex items-center justify-center gap-1.5">
            Designed for the modern seller <Zap className="w-3 h-3 fill-yellow-500/20 text-yellow-500" /> GhostReply v1.0
          </p>
        </footer>
      </div>
    </div>
  );
}
