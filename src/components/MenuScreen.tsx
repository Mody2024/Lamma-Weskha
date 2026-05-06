import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameType, GAME_DETAILS, GameSettings } from '../constants';
import { Bomb, Search, Zap, Users, ArrowLeft, Settings, Trophy, MessageCircle, Star, Drama, X, ChevronRight, PenTool, Eye, ShieldAlert, Ban, LayoutGrid, Ghost, BrainCircuit } from 'lucide-react';
import { soundService } from '../services/soundService';
import Logo from './Logo';

interface Props {
  onStart: (type: GameType, category?: string) => void;
  onOpenSettings: () => void;
  onOpenScores: () => void;
  onBackToSetup: () => void;
  playersCount: number;
  settings: GameSettings;
}

const SEARCH_CATEGORIES_AR = ['أكل', 'أماكن', 'حيوانات', 'رياضة'];
const SEARCH_CATEGORIES_EN = ['Food', 'Places', 'Animals', 'Sports'];

export default function MenuScreen({ onStart, onOpenSettings, onOpenScores, onBackToSetup, playersCount, settings }: Props) {
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const isAr = settings.language === 'ar';

  const t = {
    players: isAr ? 'لاعبين' : 'Players',
    title: isAr ? 'اللمة الوسخة' : 'The Dirty Gathering',
    subtitle: isAr ? 'جاهز للمقالب؟ 😉' : 'Ready for pranks? 😉',
    all: isAr ? 'الكل' : 'All',
    champions: isAr ? 'الأبطال' : 'Scoreboard',
    settings: isAr ? 'الإعدادات' : 'Settings',
    selectCat: isAr ? 'اختر الفئة' : 'Select Category',
    social: isAr ? 'ألعاب قعدات' : 'Social Games',
    action: isAr ? 'سرعة وحركة' : 'Action & Speed',
    brain: isAr ? 'ذكاء وتفكير' : 'Brain & Thinking'
  };

  const GAME_CATEGORIES = [
    { id: 'social', name: t.social, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'action', name: t.action, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'brain', name: t.brain, icon: BrainCircuit, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const GAMES = [
    {
      id: 'spy' as GameType,
      name: isAr ? GAME_DETAILS.spy.name : 'The Spy',
      icon: Search,
      color: 'bg-indigo-50 dark:bg-indigo-900/10',
      iconColor: 'text-indigo-500',
      category: 'social',
      searchCategories: isAr ? SEARCH_CATEGORIES_AR : SEARCH_CATEGORIES_EN
    },
    {
      id: 'who_among_us' as GameType,
      name: isAr ? GAME_DETAILS.who_among_us.name : 'Who Among Us?',
      icon: Users,
      color: 'bg-blue-50 dark:bg-blue-900/10',
      iconColor: 'text-blue-500',
      category: 'social'
    },
    {
      id: 'bomb' as GameType,
      name: isAr ? GAME_DETAILS.bomb.name : 'The Party Bomb',
      icon: Bomb,
      color: 'bg-red-50 dark:bg-red-900/10',
      iconColor: 'text-red-500',
      category: 'action',
      searchCategories: isAr ? ['عشوائي', 'عامة', 'رياضة', 'فن'] : ['Random', 'General', 'Sports', 'Art']
    },
    {
      id: 'speed' as GameType,
      name: isAr ? GAME_DETAILS.speed.name : 'The Seconds Challenge',
      icon: Zap,
      color: 'bg-amber-50 dark:bg-amber-900/10',
      iconColor: 'text-amber-500',
      category: 'action'
    },
    {
      id: 'pressure' as GameType,
      name: isAr ? GAME_DETAILS.pressure.name : 'Under Pressure',
      icon: Star,
      color: 'bg-rose-50 dark:bg-rose-900/10',
      iconColor: 'text-rose-500',
      category: 'action'
    },
    {
      id: 'distorted_word' as GameType,
      name: isAr ? GAME_DETAILS.distorted_word.name : 'Broken Word',
      icon: PenTool,
      color: 'bg-orange-50 dark:bg-orange-900/10',
      iconColor: 'text-orange-500',
      category: 'brain'
    },
    {
      id: 'convincing_answer' as GameType,
      name: isAr ? GAME_DETAILS.convincing_answer.name : 'Convincing Lie',
      icon: MessageCircle,
      color: 'bg-blue-50 dark:bg-blue-900/10',
      iconColor: 'text-blue-500',
      category: 'social'
    },
    {
      id: 'fact_fiction' as GameType,
      name: isAr ? GAME_DETAILS.fact_fiction.name : 'Fact or Fiction',
      icon: MessageCircle,
      color: 'bg-emerald-50 dark:bg-emerald-900/10',
      iconColor: 'text-emerald-500',
      category: 'social'
    },
    {
      id: 'fake_answer' as GameType,
      name: isAr ? GAME_DETAILS.fake_answer.name : 'Fake It',
      icon: Drama,
      color: 'bg-indigo-50 dark:bg-indigo-900/10',
      iconColor: 'text-indigo-500',
      category: 'social'
    },
  ];

  const filteredGames = activeCategory === 'all' 
    ? GAMES 
    : GAMES.filter(g => g.category === activeCategory);

  const handleGameClick = (game: any) => {
    soundService.play('pop');
    if (game.searchCategories) {
      setSelectedGame(game);
    } else {
      onStart(game.id);
    }
  };

  const handleCategorySelect = (category: string) => {
    soundService.play('click');
    if (selectedGame) {
      onStart(selectedGame.id, category);
      setSelectedGame(null);
    }
  };

  return (
    <div className={`flex-1 flex flex-col p-6 pt-10 overflow-hidden bg-white dark:bg-slate-900 transition-colors relative ${isAr ? '' : 'text-left'}`}>
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
           animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"
        />
        <motion.div 
           animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
           transition={{ duration: 12, repeat: Infinity }}
           className="absolute bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className={`flex justify-between items-center mb-6 ${isAr ? '' : 'flex-row-reverse'}`}>
        <button
          onClick={() => { soundService.play('click'); onBackToSetup(); }}
          className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={24} className={isAr ? '' : 'rotate-180'} />
        </button>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-5 py-2 rounded-2xl text-blue-600 dark:text-blue-400 font-black text-sm border-2 border-blue-100 dark:border-blue-900/30 shadow-sm">
          <Users size={18} />
          <span>{playersCount} {t.players}</span>
        </div>
      </div>

      <div className={`mb-6 flex items-center gap-4 ${isAr ? '' : 'flex-row-reverse text-right'}`}>
        <Logo size={64} />
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">{t.title}</h1>
          <p className="text-slate-400 font-bold">{t.subtitle}</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className={`flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar ${isAr ? '' : 'flex-row-reverse'}`}>
        <button
          onClick={() => { soundService.play('click'); setActiveCategory('all'); }}
          className={`px-6 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all ${
            activeCategory === 'all' 
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg scale-105' 
            : 'bg-slate-50 text-slate-400 dark:bg-slate-800'
          }`}
        >
          {t.all}
        </button>
        {GAME_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { soundService.play('click'); setActiveCategory(cat.id); }}
            className={`px-6 py-3 rounded-2xl font-black text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
              activeCategory === cat.id 
              ? `${cat.bg} ${cat.color} border-2 border-current shadow-md scale-105` 
              : 'bg-slate-50 text-slate-400 dark:bg-slate-800'
            }`}
          >
            <cat.icon size={16} />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4 pr-1 pb-10 custom-scrollbar content-start">
        {filteredGames.map((game, index) => (
          <motion.button
            key={game.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleGameClick(game)}
            className={`${isAr ? 'text-right' : 'text-left'} p-5 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-md border-2 border-slate-100 dark:border-slate-700/50 hover:border-blue-500/50 rounded-[2.5rem] flex flex-col gap-4 transition-all active:scale-95 group shadow-sm relative overflow-hidden`}
          >
            <div className={`w-12 h-12 ${game.color} rounded-2xl flex items-center justify-center ${game.iconColor} shadow-sm group-hover:scale-110 transition-transform`}>
              <game.icon size={28} />
            </div>
            <div>
              <h3 className="font-black text-lg dark:text-white leading-tight">{game.name}</h3>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <button
          onClick={() => { soundService.play('click'); onOpenScores(); }}
          className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <Trophy size={24} />
          <span>{t.champions}</span>
        </button>
        <button
          onClick={() => { soundService.play('click'); onOpenSettings(); }}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 transform hover:-translate-y-1"
        >
          <Settings size={24} />
          <span>{t.settings}</span>
        </button>
      </div>

      {/* Category Selection Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-6 backdrop-blur-md bg-slate-950/40"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[4rem] p-10 shadow-[0_-20px_60px_rgba(0,0,0,0.2)]"
            >
              <div className={`flex justify-between items-center mb-8 ${isAr ? '' : 'flex-row-reverse'}`}>
                <h2 className="text-3xl font-black dark:text-white italic tracking-tighter">{t.selectCat}</h2>
                <button 
                  onClick={() => { soundService.play('pop'); setSelectedGame(null); }}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {selectedGame.searchCategories?.map((cat: string) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 rounded-[2rem] font-black text-2xl text-slate-800 dark:text-white active:scale-95 transition-all touch-manipulation flex items-center justify-between group hover:border-blue-500 ${isAr ? 'text-right' : 'text-left flex-row-reverse'}`}
                  >
                    <span>{cat}</span>
                    <ChevronRight className={`text-slate-300 group-hover:text-blue-500 ${isAr ? '' : 'rotate-180'}`} />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
