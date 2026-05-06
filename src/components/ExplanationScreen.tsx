import { motion } from 'motion/react';
import { GameType, GAME_DETAILS, GameSettings } from '../constants';
import { Play, Info, ChevronRight, HelpCircle, Bomb, Search, Users, Zap, MessageCircle, Star, Drama, PenTool, Eye, ShieldAlert, Ban } from 'lucide-react';
import { soundService } from '../services/soundService';

interface Props {
  gameType: GameType;
  onContinue: () => void;
  onBackToMenu: () => void;
  settings: GameSettings;
}

const ICON_MAP: Record<string, any> = {
  bomb: Bomb,
  spy: Search,
  who_among_us: Users,
  speed: Zap,
  pressure: Star,
  fake_answer: Drama,
  fact_fiction: MessageCircle,
  distorted_word: PenTool,
  convincing_answer: MessageCircle,
  fake_memory: Eye,
  who_caused_it: ShieldAlert,
  forbidden_word: Ban,
};

export default function ExplanationScreen({ gameType, onContinue, onBackToMenu, settings }: Props) {
  const isAr = settings.language === 'ar';
  const details = GAME_DETAILS[gameType];
  const Icon = ICON_MAP[gameType] || HelpCircle;

  const t = {
    howToPlay: isAr ? 'إزاي نلعب؟' : 'How to play?',
    prize: isAr ? `الجايزة: ${details.points} نقطة` : `Prize: ${details.points} points`,
    letGo: isAr ? 'يلا بينا' : "Let's Go",
    back: isAr ? 'تراجع للمنيو' : 'Back to Menu'
  };

  // Basic English rule fallbacks if needed (simplified)
  const rules = isAr ? details.rules : (
    gameType === 'spy' ? 'Everyone knows the word except the spy. Ask questions to find them!' :
    gameType === 'bomb' ? 'Answer and pass the bomb before it explodes on you!' :
    gameType === 'who_among_us' ? 'Pick the player who most fits the description!' :
    gameType === 'speed' ? 'Answer the question in under 3 seconds!' :
    details.rules // Fallback to original
  );

  const handleContinue = () => {
    soundService.play('click');
    onContinue();
  };

  const handleBack = () => {
    soundService.play('click');
    onBackToMenu();
  };

  return (
    <div className="flex-1 flex flex-col p-8 pt-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="flex-1 flex flex-col items-center">
        <motion.div
           initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
           animate={{ scale: 1, opacity: 1, rotate: 0 }}
           className="w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-[2.5rem] flex items-center justify-center text-blue-500 mb-10 shadow-xl border-4 border-white dark:border-slate-800"
        >
          <Icon size={64} strokeWidth={2.5} />
        </motion.div>

        <h1 className="text-5xl font-black mb-4 text-slate-900 dark:text-white italic tracking-tighter text-center">{isAr ? details.name : (gameType.charAt(0).toUpperCase() + gameType.slice(1).replace('_', ' '))}</h1>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-2 rounded-2xl text-blue-600 dark:text-blue-400 font-black mb-10 text-sm border-2 border-blue-100 dark:border-blue-900/30 flex items-center gap-2">
           <Info size={16} />
           <span>{t.howToPlay}</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-slate-50 dark:bg-slate-800/50 p-10 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700 shadow-sm mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Icon size={120} />
          </div>
          <p className="text-2xl leading-relaxed text-slate-700 dark:text-slate-200 text-center font-black italic">
            {rules}
          </p>
        </motion.div>

        <div className="flex items-center gap-3 text-slate-400 mb-12 bg-slate-50 dark:bg-slate-800 px-6 py-3 rounded-full">
           <Star size={18} className="text-amber-500" fill="currentColor" />
           <span className="text-lg font-black tracking-tight">{t.prize}</span>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-3xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex items-center justify-center gap-4 active:scale-95 transition-all touch-manipulation transform hover:-translate-y-1 touch-manipulation"
        >
          <span>{t.letGo}</span>
          <ChevronRight size={32} strokeWidth={3} className={isAr ? 'rotate-180' : ''} />
        </button>

        <button 
          onClick={handleBack}
          className="w-full text-slate-400 font-black py-4 text-xl opacity-60 hover:opacity-100 transition-opacity"
        >
          {t.back}
        </button>
      </div>
    </div>
  );
}
