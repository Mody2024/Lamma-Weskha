import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, CATEGORIES, GameState, GAME_DETAILS, THEMES, FUNNY_QUOTES } from '../../constants';
import { Bomb, Check, X, ArrowRight, RotateCcw, Home, ChevronRight, Skull } from 'lucide-react';
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

export default function BombGame({ state, nextPhase, updateCurrentPlayer, updateScore, resetToMenu, players, currentPlayer }: Props) {
  const isAr = state.settings.language === 'ar';
  const theme = THEMES[state.settings.cardTheme || 'party'];

  const [timeLeft, setTimeLeft] = useState(0);
  const [topic, setTopic] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [loserQuote, setLoserQuote] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const t = {
    boom: isAr ? 'بُوووووم! 💥' : 'BOOOOOM! 💥',
    victim: isAr ? 'لبست الخازوق يا معلم' : 'You are the victim',
    scoreboard: isAr ? 'جدول الضحايا' : 'Victims List',
    ready: isAr ? 'جاهز للقنبلة؟ 🔥' : 'Ready for the bomb? 🔥',
    subtitle: isAr ? 'أول ما تبدأ، السؤال هيتغير مع كل تمريرة.. سلمها بسرعة!' : 'Once started, topics change with every pass.. move it!',
    startAction: isAr ? 'ولّـع الفتيل! 🧨' : 'Light the fuse! 🧨',
    back: isAr ? 'هروب اضطراري' : 'Emergency Exit',
    ticking: isAr ? 'العد التنازلي!' : 'Ticking!',
    saySomething: isAr ? 'قول حاجة عن:' : 'Say something about:',
    passIt: isAr ? 'اجرييييي! 💨' : 'RUN! 💨',
    holder: isAr ? 'الدنيا هترشق في:' : 'It will explode on:'
  };

  const getInitialTime = () => {
    const baseTime = state.settings.gameTime || 20;
    const diff = state.settings.difficulty;
    let multiplier = 1;
    if (diff === 'سهل') multiplier = 1.3;
    if (diff === 'صعب') multiplier = 0.7;
    // Semi-randomized time for excitement
    return Math.floor(Math.random() * 10) + (baseTime * multiplier);
  };

  useEffect(() => {
    setTimeLeft(getInitialTime());
  }, []);

  useEffect(() => {
    const categoryName = state.gameData?.category || 'عشوائي';
    let availableTopics = [];
    if (categoryName === 'عشوائي') {
      availableTopics = CATEGORIES.BOMB.map(t => t.text);
    } else {
      availableTopics = CATEGORIES.BOMB.filter(t => t.category === categoryName).map(t => t.text);
      if (availableTopics.length === 0) availableTopics = CATEGORIES.BOMB.map(t => t.text);
    }
    setTopic(availableTopics[Math.floor(Math.random() * availableTopics.length)]);
  }, [state.gameData?.category]);

  useEffect(() => {
    if (!hasStarted || isGameOver) return;

    if (timeLeft <= 0) {
      setIsGameOver(true);
      soundService.play('bomb');
      setLoserQuote(FUNNY_QUOTES[Math.floor(Math.random() * FUNNY_QUOTES.length)]);
      updateScore(currentPlayer.id, -GAME_DETAILS.bomb.points);
      
      // Vibration for mobile if enabled
      if (state.settings.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 500]);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 6 && prev > 1) soundService.play('tick');
        if (prev === 4) soundService.play('warning');
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, hasStarted, currentPlayer.id, updateScore, state.settings.vibrationEnabled]);

  const handleNextPlayer = () => {
    soundService.play('whoosh');
    const nextIndex = (state.currentPlayerIndex + 1) % players.length;
    updateCurrentPlayer(nextIndex);
    
    // Pick new topic on every pass
    const categoryName = state.gameData?.category || 'عشوائي';
    const allTopics = CATEGORIES.BOMB.map(t => t.text);
    const filteredTopics = CATEGORIES.BOMB.filter(t => t.category === categoryName).map(t => t.text);
    const source = filteredTopics.length > 0 ? filteredTopics : allTopics;
    setTopic(source[Math.floor(Math.random() * source.length)]);

    // Slightly speed up or slow down remaining time for more tension? No, keep it fair.
  };

  const handleStart = () => {
    soundService.play('whoosh');
    setHasStarted(true);
  };

  const getUrgencyStyles = () => {
    if (timeLeft < 5) return { bg: 'bg-red-800', shake: true, scale: 1.15, text: 'text-white' };
    if (timeLeft < 10) return { bg: 'bg-amber-600', shake: false, scale: 1.05, text: 'text-white' };
    return { bg: 'bg-indigo-600', shake: false, scale: 1, text: 'text-white' };
  };

  const urgency = getUrgencyStyles();

  if (isGameOver) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black text-white h-full">
        <motion.div
           initial={{ scale: 0, rotate: -180 }}
           animate={{ scale: 1, rotate: 0 }}
           transition={{ type: "spring", damping: 10 }}
           className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-red-600 blur-[100px] opacity-80 animate-pulse"></div>
          <Skull size={180} strokeWidth={1} className="drop-shadow-[0_0_50px_rgba(220,38,38,1)] relative z-10 text-red-500" />
        </motion.div>
        
        <h1 className="text-7xl font-black mb-4 tracking-tighter text-center italic text-red-600 drop-shadow-2xl uppercase">{t.boom}</h1>
        
        <div className="text-center mb-12">
          <p className="text-xl opacity-60 font-bold mb-2 uppercase tracking-widest">{t.victim}</p>
          <span className="text-7xl font-black block text-white drop-shadow-lg tracking-tighter italic">{currentPlayer.name}</span>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 mb-12 w-full max-w-sm text-center"
        >
          <p className="text-2xl font-black italic text-yellow-400">"{loserQuote}"</p>
        </motion.div>

        <div className="flex flex-col gap-4 w-full max-w-xs mt-auto">
          <button
            onClick={() => nextPhase('scoreboard')}
            className="w-full bg-red-600 text-white py-7 rounded-[3rem] font-black text-2xl shadow-[0_20px_50px_rgba(220,38,38,0.4)] active:scale-95 transition-all touch-manipulation"
          >
            {t.scoreboard}
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

  return (
    <div className={`flex-1 flex flex-col p-8 pt-16 transition-all duration-300 h-full ${hasStarted ? urgency.bg : 'bg-white dark:bg-slate-950'}`}>
      {!hasStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-48 h-48 bg-red-50 dark:bg-red-900/20 rounded-[4rem] flex items-center justify-center text-red-600 mb-10 border-4 border-red-100 shadow-2xl relative"
          >
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black text-xs animate-bounce shadow-lg">TNT</div>
            <Bomb size={100} strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-4xl font-black mb-6 dark:text-white leading-tight italic tracking-tighter">{t.ready}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-12 font-bold text-xl px-4 leading-relaxed italic">{t.subtitle}</p>
          
          <div className="w-full max-w-xs space-y-4">
            <button
              onClick={handleStart}
              className="w-full bg-red-600 text-white py-8 rounded-[3rem] font-black text-3xl shadow-[0_25px_50px_rgba(220,38,38,0.4)] active:scale-95 transition-all touch-manipulation transform hover:-translate-y-2"
            >
              {t.startAction}
            </button>
            <button 
              onClick={resetToMenu}
              className="w-full text-slate-400 font-black tracking-widest uppercase text-sm py-4"
            >
              {t.back}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-2xl px-8 py-3 rounded-full text-white font-black border-2 border-white/20 shadow-xl"
            >
              <Bomb size={28} className={timeLeft < 5 ? 'text-yellow-400 animate-pulse' : ''} />
              <span className="text-xl italic uppercase tracking-tighter">{t.ticking}</span>
            </motion.div>
            
            <div className="relative">
              <motion.div 
                animate={urgency.shake ? { x: [-4, 4, -4, 4, 0], scale: [1.2, 1.3, 1.2] } : {}}
                transition={{ repeat: Infinity, duration: 0.1 }}
                className={`text-6xl font-black text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] tracking-tighter`}
              >
                 {timeLeft}
              </motion.div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center text-center">
            <motion.div 
              key={topic}
              initial={{ x: isAr ? 100 : -100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: urgency.scale }}
              className={`w-full ${theme.bg} ${theme.border} ${theme.text} p-12 rounded-[5rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.5)] mb-12 relative overflow-hidden group min-h-[420px] flex flex-col items-center justify-center border-b-[16px] border-black/20`}
            >
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
              <p className="opacity-40 font-black mb-6 uppercase tracking-[0.4em] text-[10px] italic">{t.saySomething}</p>
              <h2 className="text-4xl font-black leading-tight tracking-tighter italic">
                {topic}
              </h2>
              <div className="mt-12 w-24 h-2 bg-black/10 dark:bg-white/10 rounded-full"></div>
            </motion.div>

            <div className="mb-12">
               <p className="text-white/60 font-black mb-2 uppercase text-xs tracking-[0.3em] font-mono">{t.holder}</p>
               <h3 className="text-4xl font-black text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)] tracking-tighter italic">{currentPlayer.name}</h3>
            </div>

            <button
               onClick={handleNextPlayer}
               className="w-full bg-white text-black py-8 rounded-[3.5rem] font-black text-4xl shadow-[0_30px_70px_rgba(0,0,0,0.5)] active:scale-90 transition-all touch-manipulation flex items-center justify-center gap-4 mt-auto mb-4 border-b-8 border-slate-200"
            >
               <span>{t.passIt}</span>
               <ChevronRight size={56} strokeWidth={4} className={isAr ? '' : 'rotate-180'} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
