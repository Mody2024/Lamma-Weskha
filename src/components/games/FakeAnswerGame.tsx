import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, CATEGORIES, GameState, GAME_DETAILS } from '../../constants';
import { Ghost, Eye, Drama, Check, X, ChevronRight } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Props {
  state: GameState;
  nextPhase: (phase: GameState['phase'], data?: any) => void;
  updateCurrentPlayer: (index: number) => void;
  updateScore: (playerId: string, points: number) => void;
  resetToMenu: () => void;
  players: Player[];
}

export default function FakeAnswerGame({ state, nextPhase, updateCurrentPlayer, updateScore, resetToMenu, players }: Props) {
  const [liarIndex, setLiarIndex] = useState(-1);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [localPhase, setLocalPhase] = useState<'revelation' | 'answering' | 'voting' | 'results'>('revelation');

  const isAr = state.settings.language === 'ar';
  const isDark = state.settings.theme === 'dark';

  useEffect(() => {
    setLiarIndex(Math.floor(Math.random() * players.length));
    
    const categoryName = state.gameData?.category || 'عشوائي';
    const items = CATEGORIES.FAKE_ANSWER;
    const item = items[Math.floor(Math.random() * items.length)];
    setQuestion(item.text);
  }, [players.length, state.gameData?.category]);

  const handleReveal = () => {
    soundService.play('reveal');
    setRevealed([...revealed, currentViewIndex]);
  };

  const handleNextReveal = () => {
    soundService.play('pop');
    if (currentViewIndex < players.length - 1) {
      setCurrentViewIndex(currentViewIndex + 1);
    } else {
      setLocalPhase('answering');
    }
  };

  const handleStartVoting = () => {
    soundService.play('click');
    setLocalPhase('voting');
  };

  const handleVote = (idx: number) => {
    const isCaught = idx === liarIndex;
    soundService.play(isCaught ? 'success' : 'fail');
    const points = GAME_DETAILS.fake_answer.points;

    if (isCaught) {
      players.forEach((p, i) => {
        if (i !== liarIndex) updateScore(p.id, points);
      });
    } else {
      updateScore(players[liarIndex].id, points * 2);
    }

    setLocalPhase('results');
  };

  const t = {
    title: isAr ? 'القول المزور 🎭' : 'The Fake Answer 🎭',
    subtitle: isAr ? 'خبي الكارت وشوف دورك!' : 'Hide your card and check your role!',
    reveal: isAr ? 'اكشف المستور' : 'Reveal Truth',
    liar: isAr ? 'أنت الكداب! 😈' : "You're the Liar! 😈",
    liarRule: isAr ? 'مهمتك تألف أذكى كدبة في التاريخ عن السؤال الجاي!' : 'Your job is to invent the smartest lie about the next question!',
    truth: isAr ? 'أنت الصادق ✅' : "You're Honest ✅",
    truthRule: isAr ? 'جاوب بصراحة وساعدهم يكتشفوا الكداب اللي بينكم!' : 'Answer honestly and help find the liar among you!',
    answeringTitle: isAr ? 'وقت الهبد المنظم! 🗣️' : 'Organized Chaos! 🗣️',
    promptLabel: isAr ? 'الموضوع اللي الكل هيتكلم عنه:' : 'The topic everyone talks about:',
    readyToVote: isAr ? 'كده تمام، صوتوا يلا' : "Ready, let's vote!",
    votingTitle: isAr ? 'مين المحوراتي؟ 🔍' : 'Who is the Liar? 🔍',
    votingSubtitle: isAr ? 'بعد ما سمعتوا الإجابات.. تفتكروا مين كان بيفشر علينا؟' : 'After hearing the answers.. who was lying?',
    caughtTitle: isAr ? 'كفشتوه يا وحوش! 🎉' : 'Busted! 🎉',
    escapedTitle: isAr ? 'ضحك عليكم وهرب! 💨' : 'He Escaped! 💨',
    wasLiar: isAr ? (name: string) => `الكداب كان فعلاً ${name}` : (name: string) => `The liar was indeed ${name}`,
    scoreboard: isAr ? 'جدول الأبطال' : 'Scoreboard',
    next: isAr ? 'سلم للي بعده' : 'Next player',
    ready: isAr ? 'أنا جاهز' : 'Ready'
  };

  const isLiar = currentViewIndex === liarIndex;
  const isRevealedForCurrent = revealed.includes(currentViewIndex);

  if (localPhase === 'answering') {
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${isDark ? 'bg-slate-900' : 'bg-slate-50'} border-t-8 border-orange-500 h-full`}>
        <div className="text-center mb-10">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="inline-flex p-6 rounded-[2.5rem] mb-6 bg-orange-100 text-orange-600 shadow-xl">
            <Drama size={56} />
          </motion.div>
          <h2 className="text-4xl font-black italic tracking-tighter">{t.answeringTitle}</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 p-10 rounded-[4rem] border shadow-2xl mb-12 text-center relative overflow-hidden">
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">{t.promptLabel}</p>
          <p className="text-4xl font-black italic leading-tight text-slate-800 dark:text-white">
            "{question}"
          </p>
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 italic text-slate-500">
             كل واحد يجاوب على السؤال ده.. الكداب لازم يقنعنا وبس!
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full mt-auto">
          <button
            onClick={handleStartVoting}
            className="w-full bg-orange-600 text-white py-6 rounded-[3rem] font-black text-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95"
          >
            {t.readyToVote}
          </button>
          <button 
            onClick={resetToMenu}
            className="w-full text-slate-400 font-black py-2 uppercase tracking-[0.2em] text-[10px] text-center"
          >
            تراجع للمنيو
          </button>
        </div>
      </div>
    );
  }

  if (localPhase === 'voting') {
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${isDark ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'} h-full`}>
        <h2 className="text-4xl font-black mb-4 text-center italic tracking-tighter underline decoration-orange-500 underline-offset-8">{t.votingTitle}</h2>
        <p className="text-slate-400 mb-10 text-center font-bold px-6">{t.votingSubtitle}</p>
        
        <div className="flex-1 overflow-y-auto space-y-4 mb-8 pr-1 custom-scrollbar">
          {players.map((player, idx) => (
            <motion.button
              key={player.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleVote(idx)}
              className="w-full p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] font-black text-2xl active:scale-95 hover:border-orange-500 shadow-lg text-center"
            >
              {player.name}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (localPhase === 'results') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black text-white text-center h-full">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-12">
            <div className={`w-40 h-40 rounded-[3rem] flex items-center justify-center mb-8 border-8 shadow-2xl bg-orange-600 border-orange-500/50`}>
               <Drama size={80} strokeWidth={3} className="text-white" />
            </div>
            <h2 className="text-5xl font-black mb-6 tracking-tighter italic text-orange-500">{t.wasLiar(players[liarIndex].name)}</h2>
        </motion.div>
        
        <div className="flex flex-col gap-4 w-full max-w-xs mt-auto">
          <button
            onClick={() => nextPhase('scoreboard')}
            className="w-full bg-white text-black py-7 rounded-[3rem] font-black text-2xl shadow-2xl active:scale-95 transform transition-transform hover:scale-105"
          >
            {t.scoreboard}
          </button>
          <button 
            onClick={resetToMenu}
            className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]"
          >
            تراجع للمنيو
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col p-8 pt-16 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} h-full border-t-8 border-orange-500`}>
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black italic tracking-tighter mb-4">{t.title}</h2>
        <div className="flex bg-orange-500/10 inline-block px-10 py-3 rounded-full border border-orange-500/20 shadow-inner">
           <p className="text-xs font-black uppercase opacity-40 mb-1 leading-none">{isAr ? 'الدور على البطل' : "PLAYER'S TURN"}</p>
           <p className="text-3xl font-black text-orange-500 italic">{players[currentViewIndex].name}</p>
        </div>
        <button 
          onClick={resetToMenu}
          className="text-slate-400 font-black py-2 uppercase tracking-[0.2em] text-[10px]"
        >
          تراجع للمنيو
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!isRevealedForCurrent ? (
            <motion.button
              key="hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ rotateY: 180, opacity: 0 }}
              onClick={handleReveal}
              className="w-full aspect-square border-4 border-dashed border-slate-300 dark:border-slate-800 rounded-[4rem] flex flex-col items-center justify-center gap-6 group hover:border-orange-500 transition-all bg-white dark:bg-slate-900 shadow-inner"
            >
              <div className="w-24 h-24 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500">
                 <Eye size={56} />
              </div>
              <span className="text-2xl font-black opacity-30">{t.reveal}</span>
            </motion.button>
          ) : (
            <motion.div
              key="revealed"
              initial={{ rotateY: -180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              className={`w-full aspect-square rounded-[4rem] flex flex-col items-center justify-center text-white p-12 shadow-2xl relative ${isLiar ? 'bg-rose-600' : 'bg-emerald-600'}`}
            >
              {isLiar ? (
                <>
                  <Ghost size={80} className="mb-6 opacity-80 animate-bounce" />
                  <h3 className="text-5xl font-black mb-4 tracking-tighter italic">{t.liar}</h3>
                  <p className="text-xl font-bold opacity-80 text-center">{t.liarRule}</p>
                </>
              ) : (
                <>
                  <Check size={80} className="mb-6 opacity-80" />
                  <h3 className="text-5xl font-black mb-4 tracking-tighter italic">{t.truth}</h3>
                  <p className="text-xl font-bold opacity-80 text-center">{t.truthRule}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleNextReveal}
        disabled={!isRevealedForCurrent}
        className="mt-12 bg-orange-600 text-white py-8 rounded-[3rem] font-black text-2xl shadow-xl disabled:opacity-20 flex items-center justify-center gap-4 transition-all active:scale-95"
      >
        <span>{isAr ? t.next : 'Next'}</span>
        <ChevronRight size={32} strokeWidth={4} />
      </button>
    </div>
  );
}
