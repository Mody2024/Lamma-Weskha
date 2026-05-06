import { motion } from 'motion/react';
import { Player, GameType, GameSettings } from '../constants';
import { Smartphone, ChevronRight } from 'lucide-react';
import { soundService } from '../services/soundService';

interface Props {
  player: Player;
  gameType: GameType;
  onReady: () => void;
  onBackToMenu?: () => void;
  settings: GameSettings;
}

export default function PassingScreen({ player, gameType, onReady, onBackToMenu, settings }: Props) {
  const isAr = settings.language === 'ar';

  const t = {
    passTime: isAr ? 'وقت التمرير' : 'Pass Time',
    passTo: isAr ? 'سلم الموبايل للبطل:' : 'Pass the phone to:',
    secret: isAr ? '(ماتخليش أي حد يلمح الكلمة غيرك! 🤫)' : "(Don't let anyone see the word! 🤫)",
    ready: isAr ? 'وصل الموبايل قوله "أنا جاهز"' : 'Phone received? Say "I\'m Ready"',
    back: isAr ? 'تراجع للمنيو' : 'Back to Menu'
  };

  const handleReady = () => {
    soundService.play('click');
    onReady();
  };

  const handleBack = () => {
    soundService.play('click');
    onBackToMenu?.();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-brand-primary dark:bg-[#0f172a] text-white transition-colors">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative mb-14"
      >
        <div className="absolute inset-0 bg-white/20 blur-[100px] rounded-full animate-pulse"></div>
        <div className="w-56 h-56 bg-white/10 rounded-[4rem] flex items-center justify-center backdrop-blur-3xl border-2 border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden group">
           <motion.div
             animate={{ rotate: [0, 10, -10, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
           >
             <Smartphone size={120} strokeWidth={1} className="drop-shadow-[0_10px_20px_rgba(255,255,255,0.3)]" />
           </motion.div>
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-6 mb-16 relative z-10"
      >
        <h2 className="text-3xl font-black uppercase tracking-widest opacity-60 mb-2 italic">{t.passTime}</h2>
        <h2 className="text-5xl font-black leading-tight tracking-tighter">
          {t.passTo}
          <br />
          <motion.span 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-yellow-400 inline-block mt-4 text-7xl font-black italic drop-shadow-[0_5px_15px_rgba(250,204,21,0.4)]"
          >
            {player.name}
          </motion.span>
        </h2>
        
        <p className="text-white/60 text-xl font-bold max-w-xs mx-auto italic mt-8">
           {t.secret}
        </p>
      </motion.div>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
        onClick={handleReady}
        className="bg-white text-blue-600 w-full max-w-sm py-7 rounded-[3rem] font-black text-4xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center gap-6 active:scale-95 transition-all touch-manipulation hover:bg-yellow-400 hover:text-white group touch-manipulation"
      >
        <span>{t.ready}</span>
        <ChevronRight size={48} strokeWidth={4} className={`group-hover:translate-x-2 transition-transform ${isAr ? 'rotate-180' : ''}`} />
      </motion.button>

      {onBackToMenu && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={handleBack}
          className="mt-6 text-white/40 font-black py-4 text-xl hover:text-white/100 transition-all uppercase tracking-widest"
        >
          {t.back}
        </motion.button>
      )}
    </div>
  );
}
