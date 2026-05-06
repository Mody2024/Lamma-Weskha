import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, CATEGORIES, GameState, GAME_DETAILS, THEMES } from '../../constants';
import { Users, CheckCircle2, ChevronRight, Home } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Props {
  state: GameState;
  nextPhase: (phase: GameState['phase'], data?: any) => void;
  updateScore: (playerId: string, points: number) => void;
  resetToMenu: () => void;
  players: Player[];
}

export default function WhoAmongUsGame({ state, nextPhase, updateScore, resetToMenu, players }: Props) {
  const [question, setQuestion] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const isAr = state.settings.language === 'ar';
  const theme = THEMES[state.settings.cardTheme || 'party'];

  const t = {
    title: isAr ? 'مين فينا؟' : 'Who Among Us?',
    caught: isAr ? 'اتقفشت! 📸' : 'Caught! 📸',
    description: isAr ? 'أكتر واحد بيناسبه الوصف هو:' : 'The one who fits the description most:',
    congrats: isAr ? (pts: number) => `مبروك.. خدت ${pts} نقاط سمعة! ✨` : (pts: number) => `Congrats.. you got ${pts} reputation points! ✨`,
    scoreboard: isAr ? 'جدول الفضايح' : 'Scoreboard',
    prompt: isAr ? 'اختاروا الشخص ده:' : 'Select this person:',
    confirm: isAr ? 'تأكيد الاختيار' : 'Confirm Choice'
  };

  useEffect(() => {
    const categoryName = state.gameData?.category || 'عشوائي';
    let availableQuestions = [];
    if (categoryName === 'عشوائي') {
      availableQuestions = CATEGORIES.WHO_AMONG_US.map(q => q.text);
    } else {
      availableQuestions = CATEGORIES.WHO_AMONG_US.filter(q => q.category === categoryName).map(q => q.text);
      if (availableQuestions.length === 0) availableQuestions = CATEGORIES.WHO_AMONG_US.map(q => q.text);
    }
    setQuestion(availableQuestions[Math.floor(Math.random() * availableQuestions.length)]);
  }, [state.gameData?.category]);

  const handleSelect = (playerId: string) => {
    soundService.play('pop');
    setSelectedPlayerId(playerId);
  };

  const handleConfirm = () => {
    if (selectedPlayerId) {
      soundService.play('success');
      updateScore(selectedPlayerId, GAME_DETAILS.who_among_us.points);
      setIsConfirmed(true);
    }
  };

  if (isConfirmed) {
    const winner = players.find(p => p.id === selectedPlayerId);
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900 transition-colors h-full">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-40 h-40 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center text-pink-500 mb-8 border-8 border-pink-200/20 shadow-[0_0_50px_rgba(236,72,153,0.3)] relative"
        >
          <div className="absolute inset-0 animate-ping bg-pink-400/20 rounded-full"></div>
          <Users size={80} className="relative z-10" />
        </motion.div>
        
        <h2 className="text-4xl font-black mb-4 text-white italic tracking-tighter">{t.caught}</h2>
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-[3rem] border border-white/20 mb-12 transform -rotate-2">
          <p className="text-xl text-pink-300 font-bold mb-2 uppercase tracking-widest">{t.description}</p>
          <h3 className="text-4xl font-black text-white drop-shadow-lg leading-none">{winner?.name}</h3>
          <p className="mt-4 text-slate-400 font-medium">{t.congrats(GAME_DETAILS.who_among_us.points)}</p>
        </div>

        <button
          onClick={() => nextPhase('scoreboard')}
          className="w-full max-w-xs bg-pink-600 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all touch-manipulation transform hover:scale-105"
        >
          <span>{t.scoreboard}</span>
          <ChevronRight size={32} strokeWidth={3} className={isAr ? '' : 'rotate-180'} />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col p-8 pt-16 bg-white dark:bg-slate-900 transition-colors ${isAr ? '' : 'text-left'}`}>
      <div className={`text-center mb-10 ${isAr ? '' : 'flex flex-col items-center'}`}>
        <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-900/10 rounded-full text-blue-500 mb-4">
          <Users size={32} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t.title}</h1>
      </div>

      <div className={`${theme.bg} ${theme.border} p-8 rounded-[2.5rem] border shadow-sm mb-10`}>
        <p className={`text-2xl font-black text-center leading-relaxed ${theme.text}`}>
          {question}
        </p>
      </div>

      <p className="text-center text-slate-400 font-bold mb-6">{t.prompt}</p>

      <div className="flex-1 overflow-y-auto space-y-3 mb-8 pr-1 custom-scrollbar">
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => handleSelect(player.id)}
            className={`w-full p-4 rounded-2xl flex items-center justify-center border-2 transition-all ${
              selectedPlayerId === player.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-[1.02]'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="font-black text-lg">{player.name}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 w-full">
        <button
          onClick={handleConfirm}
          disabled={!selectedPlayerId}
          className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-5 rounded-[2rem] font-black text-xl disabled:opacity-30 disabled:grayscale shadow-xl active:scale-95 transition-all touch-manipulation"
        >
          {t.confirm}
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
