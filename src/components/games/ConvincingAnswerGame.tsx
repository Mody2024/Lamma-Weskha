import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, GameState, CATEGORIES, THEMES } from '../../constants';
import { MessageCircle, CheckCircle2, User, ChevronRight, HelpCircle } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Props {
  state: GameState;
  players: Player[];
  nextPhase: (phase: any) => void;
  updateScore: (playerId: string, points: number) => void;
  resetToMenu: () => void;
}

export default function ConvincingAnswerGame({ state, players, nextPhase, updateScore, resetToMenu }: Props) {
  const [question, setQuestion] = useState({ q: '', a: '' });
  const [phase, setPhase] = useState<'reading' | 'inventing' | 'voting' | 'results'>('reading');
  const [correctPlayerIndex, setCorrectPlayerIndex] = useState(0);
  const [answers, setAnswers] = useState<{playerId: string, text: string}[]>([]);
  const [currentInventorIndex, setCurrentInventorIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const cardTheme = THEMES[state.settings.cardTheme || 'classic'];

  useEffect(() => {
    const q = CATEGORIES.CONVINCING[Math.floor(Math.random() * CATEGORIES.CONVINCING.length)];
    setQuestion(q);
    setCorrectPlayerIndex(Math.floor(Math.random() * players.length));
  }, [players.length]);

  const handleInvent = () => {
    if (!inputValue.trim()) return;
    soundService.play('whoosh');
    setAnswers([...answers, { playerId: players[currentInventorIndex].id, text: inputValue }]);
    setInputValue('');
    
    if (currentInventorIndex < players.length - 1) {
      setCurrentInventorIndex(currentInventorIndex + 1);
    } else {
      // Add the real answer at its position
      const finalAnswers = [...answers, { playerId: players[currentInventorIndex].id, text: inputValue }];
      // Actually we need to shuffle the real answer in.
      // Let's refine the logic.
      setPhase('voting');
    }
  };

  const handleVote = (idx: number) => {
    setSelectedIdx(idx);
    soundService.play('pop');
  };

  const getFinalShuffledAnswers = () => {
    const all = players.map((p, idx) => ({
       playerId: p.id,
       text: idx === correctPlayerIndex ? question.a : answers.find(a => a.playerId === p.id)?.text || ''
    }));
    return all.sort(() => Math.random() - 0.5);
  };

  const [shuffledAnswers, setShuffledAnswers] = useState<any[]>([]);

  useEffect(() => {
    if (phase === 'voting') {
      setShuffledAnswers(getFinalShuffledAnswers());
    }
  }, [phase]);

  if (phase === 'reading') {
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors justify-center`}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <HelpCircle size={64} className="mx-auto mb-6 text-blue-500 animate-pulse" />
          <h2 className="text-3xl font-black mb-8 leading-tight">مين هيكون مقنع أكتر؟</h2>
          <div className="p-8 rounded-[3rem] bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800 mb-10">
            <p className="text-blue-600 dark:text-blue-400 font-bold mb-4">السؤال:</p>
            <p className="text-3xl font-black italic">{question.q}</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => setPhase('inventing')}
              className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-xl active:scale-95 transition-all touch-manipulation"
            >
              يلا نألف!
            </button>
            <button 
              onClick={resetToMenu}
              className="w-full text-slate-400 font-black tracking-[0.2em] uppercase text-xs"
            >
              تراجع للمنيو
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (phase === 'inventing') {
    const inventor = players[currentInventorIndex];
    const isOwnerOfReal = currentInventorIndex === correctPlayerIndex;

    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors`}>
        <div className="flex justify-between items-center mb-10">
           <span className="font-black text-blue-500 uppercase text-xs tracking-widest">تأليف الإجابات</span>
           <span className="text-2xl font-black opacity-30">{currentInventorIndex + 1} / {players.length}</span>
        </div>
        
        <div className="flex-1">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">دور {inventor.name} ✍️</h2>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-slate-100 dark:border-slate-800">
               <p className="text-sm font-bold text-slate-400 mb-2">السؤال هو:</p>
               <p className="text-xl font-bold">{question.q}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
               key={currentInventorIndex}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="space-y-8"
            >
              {isOwnerOfReal ? (
                <div className="p-10 bg-emerald-50 dark:bg-emerald-900/20 border-4 border-emerald-500 rounded-[3rem] text-center shadow-xl">
                  <CheckCircle2 size={40} className="mx-auto mb-4 text-emerald-500" />
                  <p className="font-black text-2xl mb-4 text-emerald-600 dark:text-emerald-400">إنت المحظوظ! معاك الإجابة الصح:</p>
                  <p className="text-3xl font-black italic">{question.a}</p>
                  <p className="mt-6 text-sm font-bold text-emerald-500/60 leading-relaxed italic">ماتكتبش حاجة.. بس حاول تفضل مقنع وانت بتقولها في الآخر!</p>
                  <button 
                    onClick={() => {
                       soundService.play('whoosh');
                       if (currentInventorIndex < players.length - 1) {
                         setCurrentInventorIndex(currentInventorIndex + 1);
                       } else {
                         setPhase('voting');
                       }
                    }}
                    className="mt-8 bg-emerald-600 text-white w-full py-5 rounded-3xl font-black text-xl active:scale-95 transition-all touch-manipulation"
                  >تحرك للي بعدك</button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="ألف إجابة تقنعهم إنها حقيقية..."
                      className="w-full bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 p-8 rounded-[3rem] text-2xl font-black text-center focus:border-blue-500 outline-none transition-all shadow-inner h-48"
                    />
                    <MessageCircle className="absolute top-6 right-6 text-slate-200" size={32} />
                  </div>
                  <button
                    onClick={handleInvent}
                    disabled={!inputValue.trim()}
                    className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-xl active:scale-95 transition-all touch-manipulation flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    <span>{currentInventorIndex === players.length - 1 ? 'وقت التصويت' : 'اعتماد وتمرير'}</span>
                    <ChevronRight size={28} strokeWidth={3} />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (phase === 'voting') {
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors overflow-y-auto`}>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black mb-4 italic tracking-tighter">مين الجواب الصح؟ 🤔</h2>
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl">
             <p className="font-bold text-lg">{question.q}</p>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          {shuffledAnswers.map((ans, idx) => (
             <button
               key={idx}
               onClick={() => handleVote(idx)}
               className={`w-full p-6 text-right rounded-[2rem] border-4 transition-all ${
                 selectedIdx === idx 
                 ? 'bg-blue-600 border-blue-600 text-white scale-105 shadow-2xl z-10' 
                 : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white'
               }`}
             >
               <div className="flex items-start gap-4">
                 <div className="mt-1 opacity-20"><User size={20} /></div>
                 <p className="text-xl font-black italic">{ans.text}</p>
               </div>
             </button>
          ))}
        </div>

        <button
          onClick={() => {
             soundService.play('reveal');
             setPhase('results');
          }}
          disabled={selectedIdx === null}
          className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-6 rounded-[2.5rem] font-black text-2xl shadow-xl active:scale-95 transition-all touch-manipulation mt-auto disabled:opacity-50"
        >
          كشف الحقيقة!
        </button>
      </div>
    );
  }

  // Results Phase
  const winningAnswer = shuffledAnswers[selectedIdx || 0];
  const isCorrect = winningAnswer.playerId === players[correctPlayerIndex].id;

  return (
    <div className={`flex-1 flex flex-col p-8 pt-16 ${cardTheme.bg} ${cardTheme.text} transition-colors items-center justify-center text-center`}>
       <motion.div 
         initial={{ scale: 0.5, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className="w-full max-w-sm"
       >
          <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-8 ${isCorrect ? 'bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_50px_rgba(239,44,44,0.5)]'}`}>
             {isCorrect ? <CheckCircle2 size={64} className="text-white" /> : <HelpCircle size={64} className="text-white" />}
          </div>
          
          <h2 className={`text-6xl font-black mb-6 italic ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
            {isCorrect ? 'برافووو! 🎉' : 'اتثبتوااا! 😂'}
          </h2>

          <div className="p-8 bg-slate-100 dark:bg-slate-800 rounded-[3rem] border-b-8 border-slate-200 dark:border-slate-950 mb-10">
             <p className="text-sm font-bold text-slate-400 mb-2 uppercase">الإجابة اللي اخترتوها:</p>
             <p className="text-3xl font-black mb-4 italic">"{winningAnswer.text}"</p>
             <p className="text-lg font-bold text-blue-500">
               بتاعة: {players.find(p => p.id === winningAnswer.playerId)?.name}
             </p>
          </div>

          <button
            onClick={() => {
              if (isCorrect) updateScore(players[correctPlayerIndex].id, 20);
              else updateScore(winningAnswer.playerId, 10); // Points for fooling others
              nextPhase('scoreboard');
            }}
            className="w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-6 rounded-[2.5rem] font-black text-2xl"
          >
            النتائج والترتيب
          </button>
       </motion.div>
    </div>
  );
}
