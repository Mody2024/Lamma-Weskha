import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, CATEGORIES, GameState, GAME_DETAILS } from '../../constants';
import { Zap, Check, X, Timer, ChevronRight } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Props {
  state: GameState;
  nextPhase: (phase: GameState['phase'], data?: any) => void;
  updateCurrentPlayer: (index: number) => void;
  updateScore: (playerId: string, points: number) => void;
  resetToMenu: () => void;
  players: Player[];
  currentPlayer: Player;
}

export default function PressureGame({ state, nextPhase, updateCurrentPlayer, updateScore, resetToMenu, players, currentPlayer: initialPlayer }: Props) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'voting' | 'result'>('intro');
  const [playedIndices, setPlayedIndices] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(state.currentPlayerIndex);
  const [question, setQuestion] = useState('');
  const [timeLeft, setTimeLeft] = useState(5);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isAr = state.settings.language === 'ar';
  const isDark = state.settings.theme === 'dark';

  useEffect(() => {
    const categoryName = state.gameData?.category || 'عشوائي';
    let availableQuestions = [];
    if (categoryName === 'عشوائي') {
      availableQuestions = CATEGORIES.PRESSURE.map(q => q.text);
    } else {
      availableQuestions = CATEGORIES.PRESSURE.filter(q => q.category === categoryName).map(q => q.text);
      if (availableQuestions.length === 0) {
        availableQuestions = CATEGORIES.PRESSURE.map(q => q.text);
      }
    }
    setQuestion(availableQuestions[Math.floor(Math.random() * availableQuestions.length)]);
  }, [currentIndex, state.gameData?.category]);

  const currentPlayer = players[currentIndex];

  const startTimer = () => {
    soundService.play('click');
    setGameState('playing');
    const baseTime = state.settings.difficulty === 'سهل' ? 7 : state.settings.difficulty === 'صعب' ? 4 : 5;
    setTimeLeft(baseTime);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          soundService.play('bomb');
          setGameState('voting');
          return 0;
        }
        soundService.play('tick');
        return prev - 1;
      });
    }, 1000);
  };

  const handleFinish = (approved: boolean) => {
    soundService.play(approved ? 'success' : 'fail');
    setSuccess(approved);
    if (approved) {
      updateScore(currentPlayer.id, GAME_DETAILS.pressure.points);
    }
    setGameState('result');
    setPlayedIndices(prev => [...prev, currentIndex]);
  };

  const handleNextPlayer = () => {
    soundService.play('pop');
    if (playedIndices.length < players.length) {
      // Find next player
      let nextIdx = (currentIndex + 1) % players.length;
      while (playedIndices.includes(nextIdx) && playedIndices.length < players.length) {
        nextIdx = (nextIdx + 1) % players.length;
      }
      
      if (!playedIndices.includes(nextIdx)) {
        setCurrentIndex(nextIdx);
        setGameState('intro');
        return;
      }
    }
    nextPhase('scoreboard');
  };

  const t = {
    title: isAr ? `دورك يا ${currentPlayer.name}` : `${currentPlayer.name}'s Turn`,
    subtitle: isAr ? 'معاك 5 ثواني بس تجاوب!' : 'You have 5 seconds to answer!',
    start: isAr ? 'يلا بينا!' : "Let's Go!",
    didAnswer: isAr ? 'لحق يجاوب؟' : 'Did they answer?',
    yes: isAr ? 'إيوة لحق!' : 'Yes, they did!',
    no: isAr ? 'لأ مجاوبش..' : 'No, they failed..',
    perfect: isAr ? 'وحش! 🤜💥' : 'Beast! 🤜💥',
    perfectMsg: isAr ? 'جبتها يا بطل!' : 'You got it champ!',
    failed: isAr ? 'للأسف! 🐢' : 'Alas! 🐢',
    failedMsg: isAr ? 'الضغط كان أقوى منك!' : 'The pressure was too much!',
    next: isAr ? 'اللاعب التالي' : 'Next Player',
    results: isAr ? 'النتائج' : 'Results',
    quick: isAr ? 'بسررررعة! 🔥' : 'QUICK! 🔥'
  };

  if (gameState === 'intro') {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} transition-colors h-full`}>
        <div className="mb-12">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-amber-100 dark:bg-amber-900/30 w-24 h-24 rounded-[2rem] flex items-center justify-center text-amber-500 mb-6 mx-auto shadow-sm"
          >
            <Zap size={48} />
          </motion.div>
          <h2 className="text-4xl font-black mb-4 tracking-tighter">{t.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold">{t.subtitle}</p>
        </div>

        <button
          onClick={startTimer}
          className="bg-amber-500 text-white w-full max-w-xs py-6 rounded-[2.5rem] font-black text-2xl shadow-xl active:scale-95 transition-all touch-manipulation"
        >
          {t.start}
        </button>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center bg-amber-500 text-white h-full transition-all duration-300 ${timeLeft < 2 ? 'animate-[pulse_0.2s_infinite]' : ''}`}>
        <div className="absolute top-16 flex flex-col items-center">
           <Timer size={56} strokeWidth={3} className={`mb-2 ${timeLeft < 2 ? 'text-red-600' : ''}`} />
           <span className="text-7xl font-black tabular-nums">{timeLeft}</span>
        </div>
        
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ 
             scale: 1, 
             opacity: 1,
             x: timeLeft < 2 ? [0, -5, 5, -5, 5, 0] : 0
           }}
           transition={{ x: { repeat: Infinity, duration: 0.1 } }}
           className="bg-white text-slate-900 p-10 rounded-[3.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] w-full max-w-sm border-b-8 border-slate-200"
        >
          <p className="text-amber-500 font-black mb-4 uppercase tracking-[0.2em] text-[10px]">التحدي:</p>
          <h2 className="text-4xl font-black leading-tight mb-8 tracking-tighter italic">
            {question}
          </h2>
          <div className="text-amber-500 font-black text-2xl animate-pulse italic uppercase">{t.quick}</div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'voting') {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} transition-colors h-full`}>
        <h2 className="text-4xl font-black mb-12 tracking-tighter leading-tight italic">{t.didAnswer}</h2>
        
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <button
            onClick={() => handleFinish(true)}
            className="bg-green-500 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-lg flex items-center justify-center gap-3 active:scale-95"
          >
            <Check size={32} strokeWidth={3} />
            {t.yes}
          </button>
          <button
            onClick={() => handleFinish(false)}
            className="bg-red-500 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-lg flex items-center justify-center gap-3 active:scale-95"
          >
            <X size={32} strokeWidth={3} />
            {t.no}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${isDark ? 'bg-black text-white' : 'bg-white text-slate-900'} transition-colors h-full`}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mb-12"
      >
        {success ? (
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 bg-green-100 dark:bg-green-900/30 rounded-[2.5rem] flex items-center justify-center text-green-500 mb-6 drop-shadow-sm border-4 border-green-500/20">
              <Check size={90} strokeWidth={4} />
            </div>
            <h2 className="text-5xl font-black text-green-600 mb-2 italic tracking-tighter">{t.perfect}</h2>
            <p className="text-xl text-slate-500 font-bold">{t.perfectMsg}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 bg-red-100 dark:bg-red-900/30 rounded-[2.5rem] flex items-center justify-center text-red-500 mb-6 drop-shadow-sm border-4 border-red-500/20">
              <X size={90} strokeWidth={4} />
            </div>
            <h2 className="text-5xl font-black text-red-600 mb-2 italic tracking-tighter">{t.failed}</h2>
            <p className="text-xl text-slate-500 font-bold">{t.failedMsg}</p>
          </div>
        )}
      </motion.div>

      <div className="flex flex-col gap-4 w-full max-w-xs mt-auto">
        <button
          onClick={handleNextPlayer}
          className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-6 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-3 shadow-2xl active:scale-95"
        >
          <span>{playedIndices.length < players.length ? t.next : t.results}</span>
          <ChevronRight size={32} strokeWidth={3} />
        </button>
        <button 
          onClick={resetToMenu}
          className="text-slate-400 font-black py-2 uppercase tracking-[0.2em] text-[10px]"
        >
          تراجع للمنيو
        </button>
      </div>
    </div>
  );
}
