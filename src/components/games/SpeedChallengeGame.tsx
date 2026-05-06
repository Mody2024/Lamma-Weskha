import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, CATEGORIES, GameState, GAME_DETAILS, THEMES } from '../../constants';
import { Timer, Zap, Check, X, RotateCcw, Home, ChevronRight } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Props {
  state: GameState;
  nextPhase: (phase: GameState['phase'], data?: any) => void;
  updateScore: (playerId: string, points: number) => void;
  resetToMenu: () => void;
  players: Player[];
  currentPlayer: Player;
}

export default function SpeedChallengeGame({ state, nextPhase, updateScore, resetToMenu, players, currentPlayer: initialPlayer }: Props) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'voting' | 'result'>('intro');
  const [playedIndices, setPlayedIndices] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(state.currentPlayerIndex);
  const [question, setQuestion] = useState('');
  const [timeLeft, setTimeLeft] = useState(3.0);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isAr = state.settings.language === 'ar';
  const theme = THEMES[state.settings.cardTheme || 'party'];

  const t = {
    yourTurn: isAr ? `دورك يا ${players[currentIndex].name}` : `${players[currentIndex].name}'s Turn`,
    has3Seconds: isAr ? 'معاك 3 ثواني بس تجاوب!' : 'You have only 3 seconds to answer!',
    ready: isAr ? 'أنا جاهز!!' : "I'm Ready!!",
    beQuick: isAr ? 'بسرررررعة! 🔥' : 'QUICK! 🔥',
    didAnswer: isAr ? 'لحق يجاوب؟' : 'Did they answer?',
    everyoneDecide: isAr ? 'الكل لازم يقرر' : 'Everyone must decide',
    yes: isAr ? 'إيوة جاوب!' : 'Yes, they did!',
    no: isAr ? 'لأ مجاوبش..' : 'No, they failed..',
    rocket: isAr ? 'صاروخ! 🚀' : 'Rocket! 🚀',
    wonPoints: isAr ? (pts: number) => `كسبت ${pts} نقطة` : (pts: number) => `Swiped ${pts} points`,
    slow: isAr ? 'بطيء جداً! 🐢' : 'Too slow! 🐢',
    lostPoints: isAr ? 'راحت عليك النقاط المرة دي' : 'You lost the points this time',
    nextPlayer: isAr ? 'اللاعب التالي' : 'Next Player',
    results: isAr ? 'النتائج' : 'Results'
  };

  const currentPlayer = players[currentIndex];

  useEffect(() => {
    const categoryName = state.gameData?.category || 'عشوائي';
    let availableQuestions = [];
    if (categoryName === 'عشوائي') {
      availableQuestions = CATEGORIES.SPEED.map(q => q.text);
    } else {
      availableQuestions = CATEGORIES.SPEED.filter(q => q.category === categoryName).map(q => q.text);
      if (availableQuestions.length === 0) availableQuestions = CATEGORIES.SPEED.map(q => q.text);
    }
    setQuestion(availableQuestions[Math.floor(Math.random() * availableQuestions.length)]);
  }, [currentIndex, state.gameData?.category]);

  const startTimer = () => {
    soundService.play('click');
    setGameState('playing');
    setTimeLeft(3.0);
    const startTime = Date.now();
    const duration = 3000;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, (duration - elapsed) / 1000);
      
      const newRemaining = parseFloat(remaining.toFixed(1));
      if (Math.floor(newRemaining) !== Math.floor(timeLeft)) {
          soundService.play('tick');
      }
      if (newRemaining <= 1.0 && timeLeft > 1.0) {
          soundService.play('warning');
      }
      setTimeLeft(newRemaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        soundService.play('bomb');
        setGameState('voting');
      }
    }, 100);
  };

  const handleFinish = (approved: boolean) => {
    soundService.play(approved ? 'success' : 'fail');
    if (approved) {
      updateScore(currentPlayer.id, GAME_DETAILS.speed.points);
    }
    setSuccess(approved);
    setGameState('result');
    setPlayedIndices(prev => [...prev, currentIndex]);
  };

  const handleNextPlayer = () => {
    soundService.play('pop');
    if (playedIndices.length < players.length) {
      // Find next player who hasn't played
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

  if (gameState === 'intro') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 transition-colors">
        <div className="mb-12">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="bg-indigo-100 dark:bg-indigo-900/30 w-24 h-24 rounded-[2rem] flex items-center justify-center text-indigo-500 mb-6 mx-auto"
          >
            <Zap size={48} />
          </motion.div>
          <h2 className="text-4xl font-black mb-4 dark:text-white">{t.yourTurn}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">{t.has3Seconds}</p>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={startTimer}
            className="bg-indigo-600 text-white w-full py-5 rounded-[2rem] font-black text-2xl shadow-xl active:scale-95 transition-transform"
          >
            {t.ready}
          </button>
          <button 
            onClick={resetToMenu}
            className="w-full text-slate-400 font-black py-2 uppercase tracking-[0.2em] text-[10px]"
          >
            تراجع للمنيو
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-indigo-600 text-white h-full">
        <div className="absolute top-16 flex flex-col items-center">
           <Timer size={48} strokeWidth={3} className="mb-2" />
           <span className="text-5xl font-black tracking-tighter">{timeLeft.toFixed(1)}</span>
        </div>
        
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className={`${theme.bg} ${theme.border} ${theme.text} p-10 rounded-[3rem] shadow-2xl w-full max-w-sm`}
        >
          <h2 className="text-4xl font-black leading-tight border-b-4 border-indigo-100 pb-8 mb-8">
            {question}
          </h2>
          <div className="text-indigo-600 font-black text-2xl animate-pulse italic">{t.beQuick}</div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'voting') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 transition-colors">
        <h2 className="text-4xl font-black mb-12 dark:text-white leading-tight">{t.didAnswer}<br /><span className="text-indigo-600 text-2xl opacity-60">{t.everyoneDecide}</span></h2>
        
        <div className="flex flex-col gap-5 w-full max-w-xs">
          <button
            onClick={() => handleFinish(true)}
            className="bg-green-500 text-white py-6 rounded-[2rem] font-black text-2xl shadow-lg flex items-center justify-center gap-3 active:scale-95"
          >
            <Check size={32} strokeWidth={3} />
            {t.yes}
          </button>
          <button
            onClick={() => handleFinish(false)}
            className="bg-red-500 text-white py-6 rounded-[2rem] font-black text-2xl shadow-lg flex items-center justify-center gap-3 active:scale-95"
          >
            <X size={32} strokeWidth={3} />
            {t.no}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 transition-colors">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mb-12"
      >
        {success ? (
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-6 drop-shadow-sm">
              <Check size={80} strokeWidth={4} />
            </div>
            <h2 className="text-5xl font-black text-green-600 mb-2">{t.rocket}</h2>
            <p className="text-xl text-slate-500">{t.wonPoints(GAME_DETAILS.speed.points)}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-6 drop-shadow-sm">
              <X size={80} strokeWidth={4} />
            </div>
            <h2 className="text-5xl font-black text-red-600 mb-2">{t.slow}</h2>
            <p className="text-xl text-slate-500">{t.lostPoints}</p>
          </div>
        )}
      </motion.div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={handleNextPlayer}
            className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-2"
          >
            <span>{playedIndices.length < players.length ? t.nextPlayer : t.results}</span>
            <ChevronRight size={24} className={isAr ? '' : 'rotate-180'} />
          </button>
      </div>
    </div>
  );
}
