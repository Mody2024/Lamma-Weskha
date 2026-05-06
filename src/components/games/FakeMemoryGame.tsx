import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, GameState, CATEGORIES, THEMES } from '../../constants';
import { Eye, Zap, Search, ChevronRight, BookOpen } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Props {
  state: GameState;
  players: Player[];
  nextPhase: (phase: any) => void;
  updateScore: (playerId: string, points: number) => void;
  resetToMenu: () => void;
}

export default function FakeMemoryGame({ state, players, nextPhase, updateScore, resetToMenu }: Props) {
  const [storySet, setStorySet] = useState({ story: '', variants: [] as string[] });
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [liarIndex, setLiarIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [phase, setPhase] = useState<'reading' | 'discussing' | 'voting' | 'results'>('reading');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const cardTheme = THEMES[state.settings.cardTheme || 'dark'];

  useEffect(() => {
    const set = CATEGORIES.MEMORY[Math.floor(Math.random() * CATEGORIES.MEMORY.length)];
    setStorySet(set);
    setLiarIndex(Math.floor(Math.random() * players.length));
  }, [players.length]);

  const handleNext = () => {
    soundService.play('click');
    if (currentViewIndex < players.length - 1) {
      setCurrentViewIndex(currentViewIndex + 1);
      setIsRevealed(false);
    } else {
      setPhase('discussing');
    }
  };

  const handleVote = (idx: number) => {
    setSelectedIdx(idx);
    soundService.play('pop');
  };

  if (phase === 'reading') {
    const player = players[currentViewIndex];
    const isLiar = currentViewIndex === liarIndex;
    const story = isLiar ? storySet.variants[0] : storySet.story;

    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors`}>
        <div className="flex justify-between items-center mb-12">
           <div className="flex items-center gap-2">
             <Zap size={20} className="text-yellow-400" />
             <span className="font-black text-xs uppercase tracking-widest opacity-60">ذاكرة مزورة</span>
           </div>
           <div className="text-2xl font-black opacity-30">{currentViewIndex + 1} / {players.length}</div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="text-center mb-12 w-full">
            <h2 className="text-4xl font-black mb-4 tracking-tighter">دور {player.name} 👁️</h2>
            <p className="text-lg opacity-60 font-bold italic mb-6">اقرأ القصة بتركيز وركز في التفاصيل!</p>
            <button 
              onClick={resetToMenu}
              className="text-slate-400 font-black py-2 uppercase tracking-[0.2em] text-[10px]"
            >
              تراجع للمنيو
            </button>
          </div>

          <div className={`w-full p-1 0 rounded-[4rem] border-4 ${cardTheme.border} relative overflow-hidden group shadow-2xl`}>
             <AnimatePresence mode="wait">
               {isRevealed ? (
                 <motion.div
                   key="story"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center"
                 >
                   <motion.div 
                     animate={isLiar ? { x: [-2, 2, -2, 2, 0] } : {}}
                     transition={{ repeat: Infinity, duration: 0.1 }}
                     className="relative"
                   >
                     <p className="text-2xl sm:text-3xl font-black leading-relaxed italic">{story}</p>
                     {isLiar && <div className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay pointer-events-none"></div>}
                   </motion.div>
                   <button 
                     onClick={handleNext}
                     className="mt-12 bg-white text-slate-900 px-12 py-5 rounded-full font-black text-xl shadow-lg active:scale-95 transition-all touch-manipulation"
                   >تم الحفظ ✓</button>
                 </motion.div>
               ) : (
                 <motion.button
                   key="cover"
                   onClick={() => { setIsRevealed(true); soundService.play('reveal'); }}
                   className="w-full flex flex-col items-center justify-center gap-8 py-20 bg-slate-900/50 backdrop-blur-md rounded-[3rem"
                 >
                   <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                     <Eye size={48} className="text-white" />
                   </div>
                   <p className="text-2xl font-black text-white italic">اضغط لفتح الذاكرة</p>
                 </motion.button>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'discussing') {
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors items-center justify-center text-center`}>
         <motion.div 
           animate={{ scale: [1, 1.05, 1] }} 
           transition={{ repeat: Infinity, duration: 2 }}
           className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(255,255,255,0.1)] border-4 border-slate-700"
         >
           <BookOpen size={64} className="text-white" />
         </motion.div>
         <h2 className="text-5xl font-black mb-6 italic tracking-tighter">وقت الحوار الشيق! 🗣️</h2>
         <p className="text-xl font-bold opacity-70 mb-12 leading-relaxed italic">تناقشوا في تفاصيل القصة.. <br/> فيه واحد فيكم سمع قصة تانية خالص!</p>
         <button
           onClick={() => setPhase('voting')}
           className="w-full bg-white text-slate-950 py-7 rounded-[3rem] font-black text-3xl shadow-xl active:scale-95 transition-all touch-manipulation"
         >بدء التصويت</button>
      </div>
    );
  }

  if (phase === 'voting') {
     return (
       <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors`}>
         <div className="text-center mb-10">
           <Search size={48} className="mx-auto mb-4 opacity-50" />
           <h2 className="text-4xl font-black italic">مين اللي ذاكرته مضروبة؟ 🔍</h2>
         </div>

         <div className="grid grid-cols-2 gap-4 flex-1 content-center">
            {players.map((player, idx) => (
               <button
                 key={player.id}
                 onClick={() => handleVote(idx)}
                 className={`p-6 rounded-[2.5rem] border-4 transition-all flex flex-col items-center gap-3 ${
                   selectedIdx === idx 
                   ? 'bg-yellow-500 border-yellow-500 scale-105 shadow-2xl z-10' 
                   : 'bg-slate-900 border-slate-800 text-slate-400'
                 }`}
               >
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black ${selectedIdx === idx ? 'bg-white text-yellow-600' : 'bg-slate-800 text-slate-600'}`}>
                    {player.name[0]}
                 </div>
                 <span className="font-black text-lg text-white">{player.name}</span>
               </button>
            ))}
         </div>

         <button
           onClick={() => {
              soundService.play('reveal');
              setPhase('results');
           }}
           disabled={selectedIdx === null}
           className="w-full bg-yellow-500 text-slate-950 py-6 rounded-[2.5rem] font-black text-2xl shadow-xl active:scale-95 transition-all touch-manipulation mt-10 disabled:opacity-50"
         >كشف الذاكرة الفيك!</button>
       </div>
     );
  }

  const isCaught = selectedIdx === liarIndex;

  return (
    <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors items-center justify-center text-center`}>
       <motion.div 
         initial={{ scale: 0.5, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
       >
          <div className="text-7xl mb-8">{isCaught ? '✅' : '❌'}</div>
          <h2 className="text-5xl font-black mb-8 italic">
            {isCaught ? 'طلعتوا دقيقة ملاحظة!' : 'ضحك عليكم وباع لكم الهوا!'}
          </h2>
          
          <div className="p-8 bg-slate-900 border-2 border-slate-800 rounded-[3rem] mb-12 shadow-2xl">
             <p className="text-slate-500 font-bold mb-4 uppercase tracking-widest text-xs">الشخص اللي ذاكرته فيك:</p>
             <p className="text-4xl font-black text-yellow-500 italic mb-6">{players[liarIndex].name}</p>
             <p className="text-sm font-medium leading-relaxed opacity-60 italic">قصته كانت بتقول:</p>
             <p className="text-xl font-bold mt-2 opacity-80">"{storySet.variants[0]}"</p>
          </div>

          <button
            onClick={() => {
              if (isCaught) updateScore('group', 15);
              else updateScore(players[liarIndex].id, 20);
              nextPhase('scoreboard');
            }}
            className="w-full bg-white text-slate-900 py-6 rounded-[2.5rem] font-black text-2xl"
          >الترتيب العام</button>
       </motion.div>
    </div>
  );
}
