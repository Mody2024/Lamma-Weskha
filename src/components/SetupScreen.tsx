import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, GameSettings } from '../constants';
import { Trash2, Plus, Users, ChevronRight } from 'lucide-react';
import { soundService } from '../services/soundService';
import Logo from './Logo';

interface Props {
  players: Player[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onContinue: () => void;
  settings: GameSettings;
}

const COLORS = [
  'bg-blue-500', 'bg-red-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-pink-500', 'bg-orange-500', 'bg-indigo-500'
];

export default function SetupScreen({ players, onAdd, onRemove, onContinue, settings }: Props) {
  const [name, setName] = useState('');
  const isAr = settings.language === 'ar';

  const t = {
    title: isAr ? 'اللمة الوسخة' : 'The Dirty Gathering',
    subtitle: isAr ? 'مين فينا الضحية النهاردة؟' : 'Who is the victim today?',
    placeholder: isAr ? 'اسم اللاعب...' : 'Player name...',
    waiting: isAr ? 'مستنيين الأبطال...' : 'Waiting for heroes...',
    continue: isAr ? 'استمرار' : 'Continue'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      soundService.play('pop');
      onAdd(name.trim());
      setName('');
    }
  };

  const handleContinue = () => {
    soundService.play('click');
    onContinue();
  };

  const handleRemove = (id: string) => {
    soundService.play('fail');
    onRemove(id);
  };

  const getPlayerColor = (index: number) => COLORS[index % COLORS.length];

  return (
    <div className={`flex-1 flex flex-col p-8 pt-12 bg-white dark:bg-slate-900 transition-colors relative overflow-hidden ${isAr ? '' : 'text-left'}`}>
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             rotate: [0, 90, 0],
             x: [-20, 20, -20],
             y: [-20, 20, -20]
           }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-[4rem] blur-3xl"
        />
        <motion.div 
           animate={{ 
             scale: [1, 1.3, 1],
             rotate: [0, -90, 0],
             x: [20, -20, 20],
             y: [20, -20, 20]
           }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute -bottom-20 -right-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="mb-8 text-center flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-40 h-40 mb-6 drop-shadow-2xl relative"
        >
          <Logo size={160} />
        </motion.div>
        <h1 className="text-5xl font-black mb-2 text-slate-900 dark:text-white italic tracking-tighter">{t.title}</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.placeholder}
            className={`w-full bg-slate-50 dark:bg-slate-800 border-4 border-transparent focus:border-indigo-500 dark:focus:border-indigo-600 rounded-[2.5rem] px-8 py-6 outline-none transition-all font-black text-2xl text-slate-800 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-700 shadow-inner ${isAr ? 'pr-8 pl-14 text-right' : 'pl-8 pr-14 text-left'}`}
            dir={isAr ? 'rtl' : 'ltr'}
          />
          <button
            type="submit"
            className={`absolute ${isAr ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-4 rounded-3xl hover:bg-indigo-700 transition-colors shadow-xl active:scale-90`}
          >
            <Plus size={32} strokeWidth={3} />
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-4 mb-8 pr-1 custom-scrollbar">
        <AnimatePresence initial={false}>
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: isAr ? 20 : -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: isAr ? -20 : 20 }}
              className={`bg-white dark:bg-slate-800 p-5 rounded-[2.5rem] flex items-center justify-between border-2 border-slate-100 dark:border-slate-700 shadow-sm ${isAr ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className={`flex items-center gap-5 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-14 h-14 rounded-2xl ${getPlayerColor(index)} text-white flex items-center justify-center font-black text-2xl shadow-lg transform ${isAr ? 'rotate-3' : '-rotate-3'}`}>
                  {player.name[0].toUpperCase()}
                </div>
                <span className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">{player.name}</span>
              </div>
              <button
                onClick={() => handleRemove(player.id)}
                className="text-slate-200 dark:text-slate-600 hover:text-red-500 transition-colors p-3"
              >
                <Trash2 size={24} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {players.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300 dark:text-slate-700">
            <Users size={80} strokeWidth={1} className="mb-4 opacity-50" />
            <p className="font-bold text-lg">{t.waiting}</p>
          </div>
        )}
      </div>

      <button
        onClick={handleContinue}
        disabled={players.length < 2}
        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[2rem] font-black text-2xl disabled:opacity-20 disabled:grayscale transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
      >
        <span>{t.continue}</span>
        <ChevronRight size={28} className={isAr ? '' : 'rotate-180'} />
      </button>
      </div>
    </div>
  );
}
