import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, CATEGORIES, GameState, GAME_DETAILS } from '../../constants';
import { MessageCircle, Check, X, RotateCcw, Home, Sparkles, User, ChevronRight } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Props {
  state: GameState;
  nextPhase: (phase: GameState['phase'], data?: any) => void;
  updateScore: (playerId: string, points: number) => void;
  resetToMenu: () => void;
  players: Player[];
  currentPlayer: Player;
}

export default function TrueOrFakeGame({ state, nextPhase, updateScore, resetToMenu, players, currentPlayer: initialPlayer }: Props) {
  const [instructions, setInstructions] = useState<Record<number, 'truth' | 'lie'>>({});
  const [viewIndex, setViewIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [localPhase, setLocalPhase] = useState<'revelation' | 'playing' | 'voting' | 'result'>('revelation');
  const [topic, setTopic] = useState('');
  const [votes, setVotes] = useState<Record<number, boolean>>({}); // voterIndex -> true if they think it was truth
  const [isTruth, setIsTruth] = useState(true);

  const isAr = state.settings.language === 'ar';
  const isDark = state.settings.theme === 'dark';

  useEffect(() => {
    // Determine if the current turn's player should lie or tell truth
    const isLying = Math.random() > 0.5;
    setIsTruth(!isLying);

    const categoryName = state.gameData?.category || 'عشوائي';
    const items = CATEGORIES.FACT_FICTION;
    const item = items[Math.floor(Math.random() * items.length)];
    setTopic(item.text);
  }, []);

  const handleReveal = () => {
    soundService.play('reveal');
    setRevealed(true);
  };

  const handleStartPlaying = () => {
    soundService.play('click');
    setLocalPhase('playing');
  };

  const handleFinishTalking = () => {
    soundService.play('pop');
    setLocalPhase('voting');
  };

  const handleVote = (liarWon: boolean) => {
    soundService.play(liarWon ? 'success' : 'fail');
    const points = GAME_DETAILS.fact_fiction.points;
    const currentPlayer = players[state.currentPlayerIndex];

    if (liarWon) {
      updateScore(currentPlayer.id, points);
    }
    
    setLocalPhase('result');
    setTimeout(() => {
       // Auto progress or wait for button
    }, 2000);
  };

  const t = {
    title: isAr ? 'خبي الورقة! 🤫' : 'Hide Your Card! 🤫',
    subtitle: isAr ? (name: string) => `الدور على ${name} يشوف هيقول حقيقة ولا كدب` : (name: string) => `${name}'s turn to see if they should tell truth or lie`,
    reveal: isAr ? 'اكشف الورقة' : 'Reveal Card',
    truth: isAr ? 'لازم تقول الحقيقة! ✅' : 'Tell the Truth! ✅',
    lie: isAr ? 'لازم تكذب! 🎭' : 'You must Lie! 🎭',
    prompt: isAr ? 'الموضوع:' : 'Topic:',
    ready: isAr ? 'أنا جاهز، خبيت الورقة' : "I'm ready, hidden!",
    talking: isAr ? (name: string) => `يا ${name}، احكي لنا..` : (name: string) => `${name}, tell us..`,
    done: isAr ? 'خلصت حكاوي' : 'Done talking',
    votingTitle: isAr ? 'ها.. حقيقة ولا تأليف؟ 🤔' : 'So.. Truth or Fiction? 🤔',
    votersRule: isAr ? (name: string) => `بناءً على كلام ${name}.. المجموعة شايفة إيه؟` : (name: string) => `Based on ${name}'s story.. what does the group think?`,
    believeBtn: isAr ? 'صدقناه (بيقول حقيقة) ✅' : 'Believe (Truth) ✅',
    bustBtn: isAr ? 'كشفناه (بيتحور علينا) 🔍' : 'Busted (Liar) 🔍',
    successTitle: isAr ? 'بطل الخداع! 🏆' : 'Deception Master! 🏆',
    failTitle: isAr ? 'اتقفشت يا لئيم! 🔍' : 'Caught You! 🔍',
    successMsg: isAr ? 'ضحكت عليهم كلهم وخدت النقط!' : 'You fooled them all and got the points!',
    failMsg: isAr ? 'المجموعة كشفت تحويرة ذكية منك، المرة الجاية أحسن!' : 'The group caught your lie, better luck next time!',
    back: isAr ? 'هروب من المواجهة' : 'Run Away',
    next: isAr ? 'النتائج' : 'Results'
  };

  const currentPlayer = players[state.currentPlayerIndex];

  if (localPhase === 'revelation') {
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} h-full`}>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black italic tracking-tighter mb-4 underline decoration-emerald-500 underline-offset-8">{t.title}</h2>
          <p className="text-slate-400 font-bold px-4">{t.subtitle(currentPlayer.name)}</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.button
                key="hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={handleReveal}
                className="w-full aspect-square border-4 border-dashed border-slate-300 dark:border-slate-800 rounded-[4rem] flex flex-col items-center justify-center gap-6 bg-white dark:bg-slate-900 shadow-inner group"
              >
                <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <User size={64} />
                </div>
                <span className="text-2xl font-black text-slate-400">{t.reveal}</span>
              </motion.button>
            ) : (
              <motion.div
                key="revealed"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                className={`w-full aspect-square rounded-[4rem] flex flex-col items-center justify-center text-white p-10 shadow-2xl relative overflow-hidden ${isTruth ? 'bg-emerald-600' : 'bg-rose-600'}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                {isTruth ? <Check size={80} className="mb-6 animate-pulse" /> : <Sparkles size={80} className="mb-6 animate-bounce" />}
                <h3 className="text-5xl font-black tracking-tighter mb-6">{isTruth ? t.truth : t.lie}</h3>
                <div className="w-full bg-black/20 p-6 rounded-3xl text-center border border-white/10">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">{t.prompt}</p>
                  <p className="text-2xl font-black italic">"{topic}"</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleStartPlaying}
          disabled={!revealed}
          className="mt-12 bg-emerald-600 text-white py-8 rounded-[3rem] font-black text-2xl shadow-xl active:scale-95 disabled:opacity-20 transition-all flex items-center justify-center gap-3"
        >
          <span>{t.ready}</span>
          <ChevronRight size={32} strokeWidth={4} />
        </button>
      </div>
    );
  }

  if (localPhase === 'playing') {
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${isDark ? 'bg-slate-900 border-emerald-600' : 'bg-slate-50 border-emerald-500'} border-t-8 h-full`}>
        <div className="text-center mb-10">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className={`inline-flex p-6 rounded-[2.5rem] mb-6 shadow-xl ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}
          >
            <MessageCircle size={56} />
          </motion.div>
          <h2 className="text-4xl font-black italic tracking-tight">{t.talking(currentPlayer.name)}</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 p-12 rounded-[4rem] shadow-2xl border-2 border-emerald-500/20 mb-12 text-center relative overflow-hidden">
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
             <p className="text-3xl font-black leading-relaxed italic text-slate-800 dark:text-slate-100">
               "{topic}"
             </p>
        </div>

        <button
          onClick={handleFinishTalking}
          className="mt-auto bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95"
        >
          <span>{t.done}</span>
          <ChevronRight size={28} />
        </button>
      </div>
    );
  }

  if (localPhase === 'voting') {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} h-full`}>
        <h2 className="text-5xl font-black mb-4 tracking-tighter italic decoration-indigo-500 underline underline-offset-8">{t.votingTitle}</h2>
        <p className="text-slate-400 mb-12 font-bold text-xl px-4">{t.votersRule(currentPlayer.name)}</p>
        
        <div className="flex flex-col gap-6 w-full max-w-sm">
          <button
            onClick={() => handleVote(isTruth)} // Group thought it was truth
            className="group bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-4 border-emerald-500 shadow-xl flex items-center gap-6 active:scale-95 transition-all touch-manipulation text-left"
          >
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Check size={40} strokeWidth={4} />
            </div>
            <span className="text-2xl font-black italic text-emerald-600 dark:text-emerald-400">{t.believeBtn}</span>
          </button>

          <button
            onClick={() => handleVote(!isTruth)} // Group thought it was a lie
            className="group bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-4 border-rose-500 shadow-xl flex items-center gap-6 active:scale-95 transition-all touch-manipulation text-left"
          >
            <div className="w-16 h-16 bg-rose-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:-rotate-12 transition-transform">
              <X size={40} strokeWidth={4} />
            </div>
            <span className="text-2xl font-black italic text-rose-600 dark:text-rose-400">{t.bustBtn}</span>
          </button>
        </div>
      </div>
    );
  }

  const success = (isTruth && localPhase === 'result'); 
  // This is a bit simplified, but let's just show the summary
  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center h-full ${isDark ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <motion.div
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="mb-12"
      >
        <div className={`w-48 h-48 rounded-[4rem] flex items-center justify-center mb-8 border-8 shadow-2xl ${isTruth ? 'bg-emerald-500 border-emerald-400/50' : 'bg-rose-600 border-rose-500/50'}`}>
          {isTruth ? <Check size={100} strokeWidth={5} className="text-white" /> : <Sparkles size={100} className="text-white" />}
        </div>
        
        <h2 className={`text-6xl font-black mb-4 tracking-tighter italic ${isTruth ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isTruth ? t.successTitle : t.failTitle}
        </h2>
        <p className="text-2xl text-slate-400 font-bold px-6 leading-relaxed">
          {isTruth ? t.successMsg : t.failMsg}
        </p>
      </motion.div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => nextPhase('scoreboard')}
            className="bg-white text-black py-7 rounded-[3rem] font-black text-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95"
          >
            <span>{t.next}</span>
            <ChevronRight size={32} />
          </button>
          <button 
            onClick={resetToMenu}
            className="text-slate-500 font-black uppercase tracking-widest text-sm"
          >
            تراجع للمنيو
          </button>
      </div>
    </div>
  );
}
