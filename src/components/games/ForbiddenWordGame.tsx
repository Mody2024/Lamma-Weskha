import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, GameState, CATEGORIES, THEMES } from '../../constants';
import { AlertCircle, Ban, Eye, Target, ChevronRight, XCircle } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Props {
  state: GameState;
  players: Player[];
  nextPhase: (phase: any) => void;
  updateScore: (playerId: string, points: number) => void;
  resetToMenu: () => void;
}

export default function ForbiddenWordGame({ state, players, nextPhase, updateScore, resetToMenu }: Props) {
  const [playerWords, setPlayerWords] = useState<Record<string, string>>({});
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [phase, setPhase] = useState<'reading' | 'playing' | 'voting'>('reading');
  const [isRevealed, setIsRevealed] = useState(false);
  const [caughtPlayers, setCaughtPlayers] = useState<string[]>([]);

  const cardTheme = THEMES[state.settings.cardTheme || 'minimal'];

  useEffect(() => {
    const words = [...CATEGORIES.FORBIDDEN].sort(() => Math.random() - 0.5);
    const mapping: Record<string, string> = {};
    players.forEach((p, idx) => {
      mapping[p.id] = words[idx % words.length];
    });
    setPlayerWords(mapping);
  }, [players]);

  const handleNext = () => {
    soundService.play('click');
    if (currentViewIndex < players.length - 1) {
      setCurrentViewIndex(currentViewIndex + 1);
      setIsRevealed(false);
    } else {
      setPhase('playing');
    }
  };

  if (phase === 'reading') {
    const player = players[currentViewIndex];
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors`}>
        <div className="flex justify-between items-center mb-16">
          <Ban size={32} className="text-rose-500" />
          <span className="text-2xl font-black opacity-20">{currentViewIndex + 1} / {players.length}</span>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-4xl font-black mb-4 tracking-tighter">دور {player.name}</h2>
          <p className="text-lg opacity-40 font-black mb-12 italic">اوعى توري الكلمة لأي حد!</p>

          <div className="w-full max-w-sm aspect-square bg-slate-100 dark:bg-slate-800 rounded-[4rem] border-8 border-white dark:border-slate-900 shadow-2xl flex flex-col items-center justify-center p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
               {isRevealed ? (
                 <motion.div key="word" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                    <p className="text-rose-500 font-black text-xs uppercase tracking-widest mb-4">كلمتك الممنوعة:</p>
                    <p className="text-4xl font-black italic tracking-tighter leading-tight mb-10">"{playerWords[player.id]}"</p>
                    <button onClick={handleNext} className="bg-rose-500 text-white px-10 py-4 rounded-full font-black text-xl shadow-lg active:scale-95 transition-all touch-manipulation">حفظتها!</button>
                 </motion.div>
               ) : (
                 <motion.button key="btn" onClick={() => { setIsRevealed(true); soundService.play('reveal'); }} className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500">
                       <Eye size={40} />
                    </div>
                    <p className="text-xl font-black italic opacity-30">اضغط للكشف</p>
                 </motion.button>
               )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'playing') {
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors items-center justify-center text-center`}>
         <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="mb-12">
            <Target size={120} className="text-rose-500 opacity-20" />
         </motion.div>
         <h2 className="text-4xl font-black mb-6 italic tracking-tight">ابدأ الكلام! 📢</h2>
         <p className="text-2xl font-bold opacity-60 mb-12 italic leading-relaxed px-6">
           اتكلموا في أي حاجة.. <br/> اللي يلقط التاني بيقول كلمة ممنوعة بيخسره!
         </p>
         <div className="w-full space-y-4">
           {players.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  if (caughtPlayers.includes(p.id)) return;
                   soundService.play('fail');
                   setCaughtPlayers([...caughtPlayers, p.id]);
                }}
                className={`w-full p-5 rounded-[2rem] border-4 flex items-center justify-between transition-all ${
                  caughtPlayers.includes(p.id) 
                  ? 'bg-rose-500/10 border-rose-500/50 text-rose-500 opacity-50' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                }`}
              >
                <span className="font-black text-xl">{p.name}</span>
                {caughtPlayers.includes(p.id) ? <XCircle size={24} /> : <AlertCircle size={24} className="opacity-20" />}
              </button>
           ))}
         </div>
         <button
           onClick={() => { soundService.play('whoosh'); setPhase('voting'); }}
           className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-7 rounded-[3rem] font-black text-3xl shadow-2xl mt-12"
         >إنهاء الجلسة</button>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors`}>
       <div className="text-center mb-10">
         <h2 className="text-4xl font-black italic tracking-tighter">الكلمات اللي اتحرقت 🔥</h2>
       </div>

       <div className="space-y-4 mb-10 flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {players.map(p => (
             <div key={p.id} className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border-b-4 border-slate-100 dark:border-slate-950 flex items-center justify-between shadow-sm">
                <div>
                   <p className="text-xs font-black text-slate-400 uppercase mb-1">{p.name}</p>
                   <p className="text-3xl font-black italic">{playerWords[p.id]}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${caughtPlayers.includes(p.id) ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                   {caughtPlayers.includes(p.id) ? <XCircle /> : <CheckCircle2 />}
                </div>
             </div>
          ))}
       </div>

       <button
         onClick={() => {
           players.forEach(p => {
             if (!caughtPlayers.includes(p.id)) updateScore(p.id, 15);
           });
           nextPhase('scoreboard');
         }}
         className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-6 rounded-[2.5rem] font-black text-2xl"
       >النتائج النهائية</button>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
