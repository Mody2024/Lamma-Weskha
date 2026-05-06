import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, GameState, THEMES, FUNNY_QUOTES } from '../../constants';
import { History, ChevronRight, PenTool, Check, Award, Eye } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Props {
  state: GameState;
  players: Player[];
  nextPhase: (phase: any) => void;
  updateScore: (playerId: string, points: number) => void;
  resetToMenu: () => void;
}

export default function DistortedWordGame({ state, players, nextPhase, updateScore, resetToMenu }: Props) {
  const [originalWord, setOriginalWord] = useState('');
  const [transformations, setTransformations] = useState<{playerId: string, text: string}[]>([]);
  const [currentStep, setCurrentStep] = useState(0); 
  const [inputValue, setInputValue] = useState('');
  const [phase, setPhase] = useState<'reading' | 'results' | 'voting'>('reading');
  const [isRevealed, setIsRevealed] = useState(false);
  const [mvpVotes, setMvpVotes] = useState<Record<string, number>>({});
  const [voterIndex, setVoterIndex] = useState(0);
  const [randomQuote] = useState(FUNNY_QUOTES[Math.floor(Math.random() * FUNNY_QUOTES.length)]);

  const isAr = state.settings.language === 'ar';
  const cardTheme = THEMES[state.settings.cardTheme || 'party'];

  useEffect(() => {
    const words = ["طيارة ورق", "كوباية شاي", "قطة مغمضة", "ساندوتش كبدة", "عربية نقل", "فيل بينط", "بوابات الجنة", "عيش وملح"];
    setOriginalWord(words[Math.floor(Math.random() * words.length)]);
  }, []);

  const handleNext = () => {
    if (!inputValue.trim() && currentStep > 0) return;
    
    soundService.play('whoosh');
    setTransformations([...transformations, { playerId: players[currentStep].id, text: inputValue }]);
    setInputValue('');
    setIsRevealed(false);
    
    if (currentStep < players.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setPhase('results');
    }
  };

  const handleMvpVote = (targetId: string) => {
    soundService.play('pop');
    setMvpVotes(prev => ({ ...prev, [targetId]: (prev[targetId] || 0) + 1 }));
    
    if (voterIndex < players.length - 1) {
      setVoterIndex(voterIndex + 1);
    } else {
      // Calculate winner(s)
      const finalVotes = { ...mvpVotes, [targetId]: (mvpVotes[targetId] || 0) + 1 };
      const maxVotes = Math.max(...Object.values(finalVotes));
      players.forEach(p => {
        if (finalVotes[p.id] === maxVotes) {
          updateScore(p.id, 20);
        }
      });
      nextPhase('scoreboard');
    }
  };

  if (phase === 'results') {
    return (
      <div className={`flex-1 flex flex-col p-6 pt-12 ${cardTheme.bg} ${cardTheme.text} transition-colors h-full`}>
        <div className="text-center mb-8">
           <History size={48} className="mx-auto mb-4 opacity-30 text-indigo-500" />
           <h2 className="text-4xl font-black italic tracking-tighter">{isAr ? 'رحلة الكلمة الضايعة' : 'Word Journey'}</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-1 custom-scrollbar">
           <div className="p-6 rounded-[2.5rem] bg-indigo-500/10 border-2 border-dashed border-indigo-500/30 text-center">
              <p className="text-[10px] font-black uppercase opacity-40 mb-2">{isAr ? 'البداية' : 'START'}</p>
              <p className="text-4xl font-black italic text-indigo-500">{originalWord}</p>
           </div>

           <div className="relative pl-4">
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/50 to-transparent"></div>
              {transformations.map((t, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-6 mb-10 relative z-10"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-500 flex items-center justify-center font-black text-xl shadow-lg text-indigo-500 scale-110">
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-white/50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-sm shadow-xl">
                    <p className="text-[10px] font-black opacity-30 uppercase mb-1">{players.find(p => p.id === t.playerId)?.name}</p>
                    <p className="text-2xl font-black italic">{t.text}</p>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>

        <div className="bg-amber-400 p-4 rounded-2xl mb-6 text-slate-900 font-black text-center shadow-lg transform -rotate-1">
           "{randomQuote}"
        </div>

        <button
          onClick={() => setPhase('voting')}
          className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-6 rounded-[2.5rem] font-black text-2xl shadow-xl active:scale-95"
        >
          {isAr ? 'صوتوا لمبدع الجولة!' : 'Vote for Round MVP!'}
        </button>
      </div>
    );
  }

  if (phase === 'voting') {
    const currentVoter = players[voterIndex];
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} h-full text-center`}>
         <Award size={64} className="mx-auto mb-6 text-yellow-500" />
         <h2 className="text-4xl font-black italic tracking-tighter mb-2">{isAr ? 'مين أبدع أكتر؟' : 'Who was most creative?'}</h2>
         <p className="text-slate-500 font-bold mb-10">{isAr ? `صوت يا ${currentVoter.name}` : `Vote, ${currentVoter.name}`}</p>
         
         <div className="flex-1 overflow-y-auto space-y-3 mb-8 pr-1 custom-scrollbar">
            {players.map(p => (
              <button
                key={p.id}
                disabled={p.id === currentVoter.id}
                onClick={() => handleMvpVote(p.id)}
                className="w-full p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] font-black text-2xl italic active:scale-95 disabled:opacity-20 shadow-lg text-indigo-500"
              >
                {p.name}
              </button>
            ))}
         </div>
         <button onClick={resetToMenu} className="text-slate-400 font-black py-4 uppercase tracking-widest text-xs">تراجع للمنيو</button>
      </div>
    );
  }

  const currentPlayer = players[currentStep];
  const lastTransformation = currentStep > 0 ? transformations[currentStep - 1].text : originalWord;

  return (
    <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} h-full`}>
      <div className="text-center mb-10">
         <div className="inline-flex gap-3 items-center mb-4 bg-white/10 px-6 py-2 rounded-full border border-white/10 shadow-inner">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white"><PenTool size={16} /></div>
            <span className="font-black text-xs uppercase tracking-tighter opacity-60 decoration-indigo-500 underline underline-offset-4">{isAr ? 'كلمة مشوهة' : 'Distorted Word'}</span>
         </div>
         <h2 className="text-4xl font-black italic tracking-tighter mb-6">{isAr ? 'دور البطل' : "Hero's Turn"}</h2>
         <div className="bg-indigo-600 text-white px-10 py-3 rounded-[2rem] inline-block shadow-2xl skew-x-[-10deg]">
            <p className="text-3xl font-black italic skew-x-[10deg]">{currentPlayer.name}</p>
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
         <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.button
                key="confirm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => { setIsRevealed(true); soundService.play('reveal'); }}
                className="w-full max-w-sm aspect-square border-4 border-dashed border-indigo-500/30 rounded-[4rem] flex flex-col items-center justify-center gap-6 bg-white dark:bg-slate-900 shadow-2xl transition-all group hover:border-indigo-500"
              >
                <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                   <Eye size={56} />
                </div>
                <span className="text-2xl font-black opacity-30 italic">{isAr ? 'معايا الموبايل' : 'I have the phone'}</span>
              </motion.button>
            ) : (
              <motion.div
                key="reveal"
                initial={{ rotateY: -180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-full bg-white dark:bg-slate-800 p-10 rounded-[3.5rem] border-t-8 border-indigo-500 shadow-2xl mb-8 text-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                   <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-4">{currentStep === 0 ? (isAr ? 'الكلمة السرية:' : 'SECRET WORD:') : (isAr ? 'اللي قبلك كتب:' : 'PREVIOUS WROTE:')}</p>
                   <p className="text-4xl font-black italic tracking-tighter leading-tight">"{lastTransformation}"</p>
                </div>

                <div className="w-full space-y-6">
                   <input
                     type="text"
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     placeholder={isAr ? "اكتب نسخة مشوهة شوي..." : "Distort it a bit..."}
                     className="w-full bg-white dark:bg-slate-800 border-4 border-indigo-500/20 p-6 rounded-[2.5rem] text-2xl font-black text-center focus:border-indigo-500 outline-none transition-all shadow-inner"
                   />
                   
                   <button
                     onClick={handleNext}
                     disabled={!inputValue.trim()}
                     className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-xl active:scale-95 transition-all touch-manipulation flex items-center justify-center gap-4 disabled:opacity-50"
                   >
                     <span>{currentStep === players.length - 1 ? (isAr ? 'النتيجة الكارثية' : 'Catastrophic Result') : (isAr ? 'سلم للي بعدك' : 'Pass Phone')}</span>
                     <ChevronRight size={28} strokeWidth={3} />
                   </button>
                   
                   <button onClick={resetToMenu} className="w-full text-slate-400 font-black py-2 uppercase tracking-widest text-xs">{isAr ? 'تراجع للمنيو' : 'Back to Menu'}</button>
                </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
