import { motion } from 'motion/react';
import { GameSettings, CardTheme } from '../constants';
import { Moon, Sun, Volume2, VolumeX, Smartphone, ArrowLeft, RefreshCw, Settings, Star, Ghost, Languages } from 'lucide-react';
import { soundService } from '../services/soundService';

interface Props {
  settings: GameSettings;
  onUpdate: (settings: Partial<GameSettings>) => void;
  onBack: () => void;
  onReset: () => void;
}

export default function SettingsScreen({ settings, onUpdate, onBack, onReset }: Props) {
  const isAr = settings.language === 'ar';

  const t = {
    title: isAr ? 'الإعدادات' : 'Settings',
    playMod: isAr ? 'تعديل اللعب' : 'Game Customization',
    spies: isAr ? 'عدد الجواسيس' : 'Number of Spies',
    spy: isAr ? 'جاسوس' : 'Spy',
    time: isAr ? 'وقت الجولة' : 'Round Time',
    sec: isAr ? 'ثانية' : 'sec',
    difficulty: isAr ? 'مستوى التحدي' : 'Difficulty Level',
    cardTheme: isAr ? 'طابع الكروت' : 'Card Theme',
    preferences: isAr ? 'التفضيلات' : 'Preferences',
    appearance: isAr ? 'المظهر' : 'Appearance',
    sound: isAr ? 'الصوت' : 'Sound',
    vibration: isAr ? 'الاهتزاز' : 'Vibration',
    language: isAr ? 'اللغة' : 'Language',
    reset: isAr ? 'تصفير النقاط واللاعبين' : 'Reset Scores & Players',
    version: isAr ? 'اللمة الوسخة - الإصدار 2.0' : 'The Dirty Gathering - v2.0'
  };

  const handleUpdate = (update: Partial<GameSettings>) => {
    soundService.play('click');
    onUpdate(update);
  };

  const handleBack = () => {
    soundService.play('click');
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col p-8 pt-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={handleBack}
          className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className={`text-3xl font-black ${isAr ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white font-sans'}`}>{t.title}</h1>
      </div>

      <div className={`space-y-8 flex-1 overflow-y-auto pr-1 custom-scrollbar ${isAr ? '' : 'text-left'}`}>
        <div className="space-y-4">
          <label className="text-slate-400 text-sm font-black uppercase tracking-widest block mb-4 px-1">{t.playMod}</label>
          
          <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm">
                <Ghost size={24} />
              </div>
              <div className={isAr ? '' : 'text-left'}>
                <span className="font-black text-xl dark:text-white block">{t.spies}</span>
                <span className="text-sm font-bold text-indigo-500">{settings.spiesCount} {t.spy}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleUpdate({ spiesCount: Math.max(1, settings.spiesCount - 1) })}
                className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-lg text-slate-800 dark:text-white font-black text-2xl active:scale-90 transition-transform"
              >-</button>
              <button 
                onClick={() => handleUpdate({ spiesCount: Math.min(3, settings.spiesCount + 1) })}
                className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-lg text-slate-800 dark:text-white font-black text-2xl active:scale-90 transition-transform"
              >+</button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                <Settings size={24} />
              </div>
              <div className={isAr ? '' : 'text-left'}>
                <span className="font-black text-xl dark:text-white block">{t.time}</span>
                <span className="text-sm font-bold text-amber-500">{settings.gameTime} {t.sec}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleUpdate({ gameTime: Math.max(10, settings.gameTime - 5) })}
                className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-lg text-slate-800 dark:text-white font-black text-2xl active:scale-90 transition-transform"
              >-</button>
              <button 
                onClick={() => handleUpdate({ gameTime: Math.min(60, settings.gameTime + 5) })}
                className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-lg text-slate-800 dark:text-white font-black text-2xl active:scale-90 transition-transform"
              >+</button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                <Star size={24} />
              </div>
              <div>
                <span className="font-black text-xl dark:text-white block">{t.difficulty}</span>
              </div>
            </div>
            <button
              onClick={() => {
                const arLevels: ('سهل' | 'متوسط' | 'صعب')[] = ['سهل', 'متوسط', 'صعب'];
                const next = arLevels[(arLevels.indexOf(settings.difficulty) + 1) % arLevels.length];
                handleUpdate({ difficulty: next });
              }}
              className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all touch-manipulation min-w-[100px]"
            >
              {isAr ? settings.difficulty : settings.difficulty === 'سهل' ? 'Easy' : settings.difficulty === 'متوسط' ? 'Med' : 'Hard'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-slate-400 text-sm font-black uppercase tracking-widest block mb-4 px-1">{t.cardTheme}</label>
          <div className="grid grid-cols-2 gap-4">
             {(['classic', 'notebook', 'dark', 'party', 'minimal'] as CardTheme[]).map(t => (
               <button
                 key={t}
                 onClick={() => handleUpdate({ cardTheme: t })}
                 className={`p-4 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-2 ${
                   settings.cardTheme === t 
                   ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                   : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500'
                 }`}
               >
                 <div className={`w-10 h-10 rounded-full ${t === 'dark' ? 'bg-slate-900 border border-slate-700' : t === 'notebook' ? 'bg-[#fdf6e3] border border-[#93a1a1]/30' : t === 'party' ? 'bg-gradient-to-br from-indigo-500 to-pink-500' : 'bg-white border'}`}></div>
                 <span className="font-black text-xs uppercase tracking-tighter">
                   {t === 'classic' ? 'كلاسيك' : t === 'notebook' ? 'نوت بوك' : t === 'dark' ? 'ليلي فخم' : t === 'party' ? 'حفلة' : 'بسيط'}
                 </span>
               </button>
             ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-slate-400 text-sm font-black uppercase tracking-widest block mb-4 px-1">{t.preferences}</label>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-500">
                <Languages size={24} />
              </div>
              <span className="font-bold text-lg dark:text-white">{t.language}</span>
            </div>
            <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
              <button 
                onClick={() => handleUpdate({ language: 'ar' })}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${settings.language === 'ar' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >AR</button>
              <button 
                onClick={() => handleUpdate({ language: 'en' })}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${settings.language === 'en' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >EN</button>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-500">
                {settings.theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
              </div>
              <span className="font-bold text-lg dark:text-white">{t.appearance}</span>
            </div>
            <button
              onClick={() => handleUpdate({ theme: settings.theme === 'light' ? 'dark' : 'light' })}
              className={`w-16 h-8 rounded-full transition-all relative ${settings.theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <motion.div
                animate={{ x: settings.theme === 'dark' ? 32 : 4 }}
                className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm"
              />
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-500">
                {settings.soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </div>
              <span className="font-bold text-lg dark:text-white">{t.sound}</span>
            </div>
            <button
              onClick={() => handleUpdate({ soundEnabled: !settings.soundEnabled })}
              className={`w-16 h-8 rounded-full transition-all relative ${settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <motion.div
                animate={{ x: settings.soundEnabled ? 32 : 4 }}
                className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm"
              />
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl text-rose-500">
                <Smartphone size={24} />
              </div>
              <span className="font-bold text-lg dark:text-white">{t.vibration}</span>
            </div>
            <button
              onClick={() => handleUpdate({ vibrationEnabled: !settings.vibrationEnabled })}
              className={`w-16 h-8 rounded-full transition-all relative ${settings.vibrationEnabled ? 'bg-rose-600' : 'bg-slate-200'}`}
            >
              <motion.div
                animate={{ x: settings.vibrationEnabled ? 32 : 4 }}
                className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm"
              />
            </button>
          </div>
        </div>

        <div className="pt-8">
           <button
            onClick={() => { soundService.play('fail'); onReset(); }}
            className="w-full bg-red-50 dark:bg-red-900/10 text-red-500 py-5 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 border border-red-100 dark:border-red-900/40"
           >
              <RefreshCw size={20} />
              <span>{t.reset}</span>
           </button>
        </div>
      </div>

      <p className="text-center text-slate-400 text-xs py-8">{t.version}</p>
    </div>
  );
}
