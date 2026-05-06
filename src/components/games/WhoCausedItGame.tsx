import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, GameState, CATEGORIES, THEMES } from '../../constants';
import { ShieldAlert, Fingerprint, Eye, Search, ChevronRight, UserX } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Props {
  state: GameState;
  players: Player[];
  nextPhase: (phase: any) => void;
  updateScore: (playerId: string, points: number) => void;
  resetToMenu: () => void;
}

export default function WhoCausedItGame({ state, players, nextPhase, updateScore, resetToMenu }: Props) {
  const [scenario, setScenario] = useState('');
  const [liarIndex, setLiarIndex] = useState(0);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [phase, setPhase] = useState<'reading' | 'defending' | 'voting' | 'results'>('reading');
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const cardTheme = THEMES[state.settings.cardTheme || 'dark'];

  useEffect(() => {
    setScenario(CATEGORIES.CAUSED_IT[Math.floor(Math.random() * CATEGORIES.CAUSED_IT.length)]);
    setLiarIndex(Math.floor(Math.random() * players.length));
  }, [players.length]);

  const handleNext = () => {
    soundService.play('click');
    if (currentViewIndex < players.length - 1) {
      setCurrentViewIndex(currentViewIndex + 1);
      setIsRevealed(false);
    } else {
      setPhase('defending');
    }
  };

  if (phase === 'reading') {
    const player = players[currentViewIndex];
    const isLiar = currentViewIndex === liarIndex;

    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors`}>
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <ShieldAlert size={24} className="text-red-500" />
            <span className="font-black text-xs uppercase tracking-[0.2em] opacity-60">ملف القضية</span>
          </div>
          <button 
            onClick={resetToMenu}
            className="text-slate-400 font-black py-2 uppercase tracking-[0.2em] text-[10px]"
          >
            تراجع للمنيو
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">المتهم: {player.name}</h2>
            <p className="text-lg opacity-60 font-bold italic">افتح الملف وشوف انت بريء ولا "السبب"!</p>
          </div>

          <div className={`w-full max-w-md aspect-[3/4] p-10 rounded-[4rem] border-4 ${cardTheme.border} relative overflow-hidden bg-slate-900/40 shadow-2xl flex flex-col items-center justify-center`}>
            <AnimatePresence mode="wait">
              {isRevealed ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                   <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-8 ${isLiar ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                      {isLiar ? <UserX size={48} /> : <Fingerprint size={48} />}
                   </div>
                   <h3 className={`text-4xl font-black mb-4 ${isLiar ? 'text-red-500' : 'text-emerald-500'}`}>
                     {isLiar ? 'إنت السبب! 🔥' : 'إنت بريء 🛡️'}
                   </h3>
                   <p className="text-xl opacity-60 font-medium italic mb-10 leading-relaxed">
                     {isLiar ? "الكارثة دي حصلت بسببك.. حاول تلبسها في حد!" : "ملكش دعوة بالمصيبة دي، بس حاول تلاقي الفاعل!"}
                   </p>
                   <button 
                     onClick={handleNext}
                     className="bg-white text-slate-950 px-12 py-5 rounded-full font-black text-xl shadow-lg"
                   >علم وينفذ</button>
                </motion.div>
              ) : (
                <motion.button
                  key="id"
                  onClick={() => { setIsRevealed(true); soundService.play('reveal'); }}
                  className="w-full h-full flex flex-col items-center justify-center gap-6"
                >
                   <div className="w-20 h-20 rounded-3xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                     <Search size={40} className="text-slate-500" />
                   </div>
                   <p className="text-xl font-bold tracking-widest opacity-30 italic">اضغط للبصمة التحليلية</p>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'defending') {
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors items-center justify-center text-center`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-sm">
           <Eye size={80} className="mx-auto mb-10 text-red-500 animate-pulse" />
           <h2 className="text-4xl font-black mb-6 italic tracking-tighter">وادينا عرفنا المصيبة:</h2>
           <div className="p-8 bg-slate-900 border-2 border-slate-800 rounded-[3rem] mb-12 shadow-inner">
             <p className="text-huge font-black italic tracking-tighter leading-tight drop-shadow-xl">
               "{scenario}"
             </p>
           </div>
           <p className="text-xl font-bold opacity-60 italic mb-10">دافعوا عن نفسكم.. المحقق بيسمع!</p>
           <button
             onClick={() => setPhase('voting')}
             className="w-full bg-red-600 text-white py-7 rounded-[3rem] font-black text-3xl shadow-2xl active:scale-95 transition-all touch-manipulation"
           >من هو الجاني؟</button>
        </div>
      </div>
    );
  }

  if (phase === 'voting') {
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors`}>
         <div className="text-center mb-10">
           <Search size={48} className="mx-auto mb-4 opacity-40" />
           <h2 className="text-4xl font-black italic tracking-tighter">صوتوا على الجاني 🫵</h2>
         </div>

         <div className="space-y-4 mb-10">
           {players.map((p, idx) => (
             <button
               key={p.id}
               onClick={() => { setSelectedIdx(idx); soundService.play('pop'); }}
               className={`w-full p-6 text-right rounded-[2.5rem] border-4 transition-all ${
                 selectedIdx === idx 
                 ? 'bg-red-600 border-red-600 text-white scale-[1.02] shadow-2xl' 
                 : 'bg-slate-900 border-slate-800 text-slate-400'
               }`}
             >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${selectedIdx === idx ? 'bg-white text-red-600' : 'bg-slate-800'}`}>
                    {idx + 1}
                  </div>
                  <span className="text-2xl font-black italic">{p.name}</span>
                </div>
             </button>
           ))}
         </div>

         <button
           onClick={() => { soundService.play('reveal'); setPhase('results'); }}
           disabled={selectedIdx === null}
           className="w-full bg-slate-100 text-slate-950 py-6 rounded-[2.5rem] font-black text-3xl shadow-xl mt-auto disabled:opacity-50"
         >كشف الحقيقة الدامية</button>
      </div>
    );
  }

  const isCaught = selectedIdx === liarIndex;

  return (
    <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors items-center justify-center text-center`}>
       <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="mb-10 w-24 h-24 rounded-[2rem] bg-red-600 mx-auto flex items-center justify-center text-white text-5xl shadow-2xl">
             {isCaught ? '🚔' : '🎭'}
          </div>
          
          <h2 className="text-5xl font-black mb-8 italic tracking-tighter">
            {isCaught ? 'اتمسك متلبس! 🎉' : 'هرب من العدالة! 😎'}
          </h2>

          <div className="p-10 bg-slate-900 border-2 border-slate-800 rounded-[4rem] mb-12 shadow-2xl">
             <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-4 italic">الجاني الحقيقي هو:</p>
             <p className="text-4xl font-black italic underline decoration-red-600">{players[liarIndex].name}</p>
          </div>

          <button
            onClick={() => {
              if (isCaught) updateScore('group', 15);
              else updateScore(players[liarIndex].id, 25);
              nextPhase('scoreboard');
            }}
            className="w-full bg-white text-slate-950 py-7 rounded-[3rem] font-black text-3xl"
          >استكمال التحقيق</button>
       </motion.div>
    </div>
  );
}
