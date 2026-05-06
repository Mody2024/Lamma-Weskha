import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, GameState } from '../constants';
import { Trophy, Home, RotateCcw, ChevronRight, User, Crown, Medal, Star } from 'lucide-react';
import { soundService } from '../services/soundService';

interface Props {
  state: GameState;
  players: Player[];
  onContinue: () => void;
  onReset: () => void;
  isGameOver?: boolean;
}

export default function ScoreboardScreen({ state, players, onContinue, onReset, isGameOver = false }: Props) {
  const isAr = state.settings.language === 'ar';
  const isDark = state.settings.theme === 'dark';

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const podium = sortedPlayers.slice(0, 3);
  const others = sortedPlayers.slice(3);

  useEffect(() => {
    soundService.play('success');
  }, []);

  const t = {
    title: isAr ? 'قاعة الأساطير 🏆' : 'Hall of Legends 🏆',
    subtitle: isAr ? 'من سيتربع على العرش؟' : 'Who will claim the throne?',
    playAgain: isAr ? 'جولة تانية يا وحوش؟' : 'Another round, beasts?',
    points: isAr ? 'نقطة' : 'pts',
    nextRound: isAr ? 'المواجهة التالية' : 'Next Confrontation',
    newGame: isAr ? 'بداية جديدة' : 'New Beginning',
    mainMenu: isAr ? 'القائمة الرئيسية' : 'Main Menu'
  };

  const getRankStyle = (index: number) => {
    switch(index) {
      case 0: return { bg: 'bg-gradient-to-b from-yellow-300 to-yellow-600', text: 'text-amber-950', size: 'h-48' };
      case 1: return { bg: 'bg-gradient-to-b from-slate-200 to-slate-400', text: 'text-slate-900', size: 'h-36' };
      case 2: return { bg: 'bg-gradient-to-b from-amber-500 to-amber-800', text: 'text-amber-100', size: 'h-28' };
      default: return { bg: 'bg-slate-800', text: 'text-white', size: 'h-20' };
    }
  };

  return (
    <div className={`flex-1 flex flex-col ${isDark ? 'bg-[#050510] text-white' : 'bg-slate-50 text-slate-900'} h-full overflow-hidden relative`}>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[80%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[70%] h-[50%] bg-purple-600/10 blur-[100px] rounded-full animate-pulse [animation-delay:1s]"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-6 pt-10">
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block"
          >
            <h1 className="text-4xl font-black italic tracking-tighter mb-2 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent animate-shimmer">{t.title}</h1>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">{t.subtitle}</p>
          </motion.div>
        </div>

        {/* Podium Redesign */}
        <div className="flex items-end justify-center gap-2 mb-12 h-64 px-4">
          {/* Second Place */}
          {podium[1] && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center flex-1"
            >
              <div className="w-12 h-12 rounded-full border-2 border-slate-300 bg-slate-800 flex items-center justify-center mb-2 overflow-hidden shadow-lg">
                <span className="font-black text-slate-300 text-xl">{podium[1].name[0].toUpperCase()}</span>
              </div>
              <div className={`w-full ${getRankStyle(1).bg} rounded-t-3xl shadow-2xl flex flex-col items-center pt-4 relative`}>
                 <Medal className="text-slate-500 absolute -top-3" size={24} />
                 <span className={`${getRankStyle(1).text} font-black text-xs truncate max-w-[80%] px-1`}>{podium[1].name}</span>
                 <span className={`${getRankStyle(1).text} font-black text-lg mt-1`}>{podium[1].score}</span>
                 <div className={`w-full ${getRankStyle(1).size}`}></div>
              </div>
            </motion.div>
          )}

          {/* First Place */}
          {podium[0] && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center flex-1 z-10"
            >
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-20 h-20 rounded-full border-4 border-yellow-400 bg-slate-800 flex items-center justify-center mb-3 shadow-[0_0_40px_rgba(250,204,21,0.5)] relative"
              >
                <div className="absolute -top-6 animate-bounce"><Crown className="text-yellow-400 fill-yellow-400" size={32} /></div>
                <span className="font-black text-yellow-400 text-3xl">{podium[0].name[0].toUpperCase()}</span>
              </motion.div>
              <div className={`w-full ${getRankStyle(0).bg} rounded-t-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col items-center pt-6 relative`}>
                 <span className={`${getRankStyle(0).text} font-black text-sm uppercase tracking-tight truncate max-w-[90%] px-1`}>{podium[0].name}</span>
                 <span className={`${getRankStyle(0).text} font-black text-3xl mt-1 tracking-tighter`}>{podium[0].score}</span>
                 <span className={`${getRankStyle(0).text} text-[8px] font-black opacity-60`}>{t.points}</span>
                 <div className={`w-full ${getRankStyle(0).size}`}></div>
              </div>
            </motion.div>
          )}

          {/* Third Place */}
          {podium[2] && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center flex-1"
            >
              <div className="w-10 h-10 rounded-full border-2 border-amber-700 bg-slate-800 flex items-center justify-center mb-2 overflow-hidden shadow-lg">
                <span className="font-black text-amber-700 text-lg">{podium[2].name[0].toUpperCase()}</span>
              </div>
              <div className={`w-full ${getRankStyle(2).bg} rounded-t-3xl shadow-2xl flex flex-col items-center pt-3 relative`}>
                 <Medal className="text-amber-900 absolute -top-2" size={20} />
                 <span className={`${getRankStyle(2).text} font-black text-[10px] truncate max-w-[80%] px-1`}>{podium[2].name}</span>
                 <span className={`${getRankStyle(2).text} font-black text-md mt-1`}>{podium[2].score}</span>
                 <div className={`w-full ${getRankStyle(2).size}`}></div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Others List */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-8 pr-1 custom-scrollbar scroll-smooth">
          {others.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: (index + 3) * 0.1 }}
              className="p-5 rounded-[2rem] flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 shadow-lg group hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-500 border border-white/5">
                   {index + 4}
                </div>
                <div>
                   <h4 className="font-black text-lg italic tracking-tight">{player.name}</h4>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-xl font-black text-indigo-400">{player.score}</span>
                 <span className="text-[10px] font-bold opacity-30 uppercase">{t.points}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {!isGameOver ? (
            <button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-[0_15px_35px_rgba(79,70,229,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-all touch-manipulation group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <span>{t.nextRound}</span>
              <ChevronRight size={32} strokeWidth={3} />
            </button>
          ) : (
            <button
              onClick={onReset}
              className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all touch-manipulation"
            >
              <RotateCcw size={28} />
              {t.newGame}
            </button>
          )}
          <button
            onClick={onReset}
            className="w-full bg-white/5 text-slate-400 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/5"
          >
            <Home size={18} />
            <span className="text-xs uppercase tracking-widest">{t.mainMenu}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
