import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, CATEGORIES, GameState, GAME_DETAILS, THEMES } from '../../constants';
import { Search, Eye, Ghost, Check, X, ChevronRight, User } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Props {
  state: GameState;
  nextPhase: (phase: GameState['phase'], data?: any) => void;
  updateCurrentPlayer: (index: number) => void;
  updateScore: (playerId: string, points: number) => void;
  resetToMenu: () => void;
  players: Player[];
}

export default function SpyGame({ state, nextPhase, updateCurrentPlayer, updateScore, resetToMenu, players }: Props) {
  const [spyIndices, setSpyIndices] = useState<number[]>([]);
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [voterIndex, setVoterIndex] = useState(0);
  const [caughtIndices, setCaughtIndices] = useState<number[]>([]);
  const [word, setWord] = useState('');
  const [category, setCategory] = useState('');
  const [revealed, setRevealed] = useState<number[]>([]);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [localPhase, setLocalPhase] = useState<'revelation' | 'playing' | 'secret_voting' | 'thriller_reveal' | 'results'>('revelation');
  const [isRevealDone, setIsRevealDone] = useState(false);

  const theme = state.settings.cardTheme;
  const tProps = THEMES[theme];
  const isDark = state.settings.theme === 'dark';
  const isAr = state.settings.language === 'ar';

  useEffect(() => {
    const count = state.settings.spiesCount || 1;
    const indices: number[] = [];
    while (indices.length < count) {
      const idx = Math.floor(Math.random() * players.length);
      if (!indices.includes(idx)) indices.push(idx);
    }
    
    const items = CATEGORIES.SPY;
    const item = items[Math.floor(Math.random() * items.length)];
    setSpyIndices(indices);
    setWord(item.word);
    setCategory(item.category);
  }, [players.length, state.settings.spiesCount]);

  const handleReveal = () => {
    soundService.play('reveal');
    setRevealed([...revealed, currentViewIndex]);
  };

  const handleNextReveal = () => {
    soundService.play('pop');
    if (currentViewIndex < players.length - 1) {
      setCurrentViewIndex(currentViewIndex + 1);
    } else {
      setLocalPhase('playing');
    }
  };

  const handleStartVoting = () => {
    soundService.play('click');
    setVoterIndex(0);
    setLocalPhase('secret_voting');
  };

  const handleCastVote = (votedIdx: number) => {
    soundService.play('pop');
    setVotes({ ...votes, [voterIndex]: votedIdx });
    
    if (voterIndex < players.length - 1) {
      setVoterIndex(voterIndex + 1);
    } else {
      setLocalPhase('thriller_reveal');
      setTimeout(() => {
        soundService.play('reveal');
        setIsRevealDone(true);
      }, 4000); // 4 seconds of suspense
    }
  };

  const getResults = () => {
    const voteCounts: Record<string, number> = {};
    (Object.values(votes) as number[]).forEach(idx => {
      const key = String(idx);
      voteCounts[key] = (voteCounts[key] || 0) + 1;
    });

    let maxVotes = 0;
    let mostVotedIdx = -1;
    Object.entries(voteCounts).forEach(([idx, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        mostVotedIdx = Number(idx);
      }
    });

    return { mostVotedIdx, maxVotes };
  };

  const finalizeGame = () => {
    soundService.play('click');
    const { mostVotedIdx } = getResults();
    const isSpy = spyIndices.includes(mostVotedIdx);
    const points = GAME_DETAILS.spy.points;

    if (isSpy) {
      soundService.play('success');
      // If spy is caught, teammates get points
      players.forEach((p, i) => {
        if (!spyIndices.includes(i)) updateScore(p.id, points);
      });
      
      const newCaught = [...caughtIndices, mostVotedIdx];
      setCaughtIndices(newCaught);
      
      // Check if all spies caught
      const allCaught = spyIndices.every(idx => newCaught.includes(idx));
      
      if (allCaught) {
        const spyNames = spyIndices.map(i => players[i].name).join(isAr ? ' و ' : ' & ');
        nextPhase('results', { caught: true, name: spyNames, word });
      } else {
        // More spies remain! Go back to playing for more interrogation
        setVotes({});
        setVoterIndex(0);
        setIsRevealDone(false);
        setLocalPhase('playing');
        soundService.play('warning');
      }
    } else {
      // Innocent voted out! Spies win
      soundService.play('fail');
      spyIndices.forEach(idx => updateScore(players[idx].id, points * 2));
      const spyNames = spyIndices.map(i => players[i].name).join(isAr ? ' و ' : ' & ');
      nextPhase('results', { caught: false, name: spyNames, word });
    }
  };

  const t = {
    interrogation: isAr ? 'وقت التحقيق! 🕵️‍' : 'Interrogation Time! 🕵️‍',
    category: isAr ? 'الفئة كانت' : 'THE CATEGORY WAS',
    rule: isAr ? 'كل واحد هيسأل اللي جنبه سؤال عن الكلمة السرية... بس بشويش! 🤐' : 'Everyone ask the person next to you one question about the secret word... quietly! 🤐',
    back: isAr ? 'تراجع للمنيو' : 'Back to Menu',
    voteNow: isAr ? 'يلا نصوت! 📢' : 'Vote Now! 📢',
    passToVote: isAr ? (name: string) => `سلم الموبايل لـ ${name} عشان يصوت` : (name: string) => `Pass the phone to ${name} to vote`,
    revealSpy: isAr ? 'كشف الجاسوس!' : 'The Reveal!',
    suspense: isAr ? 'جاري فرز الأصوات والتحقيق مع المشتبه فيهم...' : 'Counting votes and investigating suspects...',
    mostVoted: isAr ? 'أكتر واحد خد أصوات هو:' : 'The most voted person is:',
    continue: isAr ? 'نشوف الحقيقة..' : 'Reveal the truth..',
    ready: isAr ? 'أنا جاهز' : "I'm ready"
  };

  if (localPhase === 'playing') {
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${isDark ? 'bg-slate-900 border-indigo-600' : 'bg-slate-50 border-indigo-500'} border-t-8 h-full`}>
        <div className="text-center mb-10">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className={`inline-flex p-6 rounded-[3rem] mb-6 shadow-xl ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}
          >
            <Search size={56} />
          </motion.div>
          <h2 className="text-4xl font-black italic tracking-tight">{t.interrogation}</h2>
          <div className="mt-8 inline-block px-10 py-3 rounded-full border bg-white dark:bg-slate-800 shadow-md">
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-1">{t.category}</p>
            <p className="text-indigo-600 dark:text-indigo-400 font-black text-3xl">{category}</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 p-10 rounded-[3.5rem] border shadow-2xl mb-12 text-center"
        >
          <p className="text-2xl font-black leading-relaxed text-slate-800 dark:text-slate-100 italic">
             {t.rule}
          </p>
        </motion.div>

        <div className="mt-auto space-y-4">
          <button
            onClick={handleStartVoting}
            className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95"
          >
            {t.voteNow}
          </button>
          <button 
            onClick={resetToMenu}
            className="w-full text-slate-400 font-black py-4 text-sm uppercase tracking-widest"
          >
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  if (localPhase === 'secret_voting') {
    const voter = players[voterIndex];
    return (
      <div className={`flex-1 flex flex-col p-8 pt-16 ${isDark ? 'bg-slate-950' : 'bg-slate-50'} h-full`}>
        <div className="text-center mb-10">
          <p className="text-slate-400 font-black text-xs tracking-[0.3em] uppercase mb-2 italic">Secret Voting</p>
          <h2 className="text-4xl font-black italic tracking-tighter text-indigo-500">{t.passToVote(voter.name)}</h2>
        </div>

        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-1">
          {players.map((player, idx) => (
            <motion.button
              key={player.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: idx === voterIndex ? 0.3 : 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleCastVote(idx)}
              disabled={idx === voterIndex}
              className={`w-full p-6 border-4 rounded-[2.5rem] font-black text-2xl active:scale-95 transition-all touch-manipulation flex items-center gap-4 bg-white dark:bg-slate-900 shadow-xl ${idx === voterIndex ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:border-indigo-500'}`}
            >
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-indigo-500 font-black">
                {idx + 1}
              </div>
              <span className="flex-1 text-center">{player.name}</span>
              <Check className="opacity-0 group-active:opacity-100 text-green-500" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (localPhase === 'thriller_reveal') {
    const { mostVotedIdx, maxVotes } = getResults();
    const mostVotedPlayer = players[mostVotedIdx];

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black text-white h-full text-center">
        <AnimatePresence mode="wait">
          {!isRevealDone ? (
            <motion.div 
              key="suspense"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="space-y-12"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                  filter: ["blur(0px)", "blur(10px)", "blur(0px)"]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-48 h-48 border-8 border-indigo-500 border-t-transparent rounded-full mx-auto flex items-center justify-center"
              >
                <div className="w-32 h-32 border-8 border-pink-500 border-b-transparent rounded-full animate-spin-slow"></div>
              </motion.div>
              <h2 className="text-4xl font-black italic tracking-tighter animate-pulse">{t.suspense}</h2>
            </motion.div>
          ) : (
            <motion.div 
              key="reveal"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full flex flex-col items-center"
            >
              <Ghost size={120} className="text-indigo-500 mb-8 animate-bounce" />
              <h3 className="text-2xl font-black opacity-60 uppercase tracking-widest mb-4">{t.mostVoted}</h3>
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="bg-white/10 backdrop-blur-2xl p-10 rounded-[4rem] border-4 border-indigo-500/50 mb-12 w-full max-w-sm shadow-[0_0_80px_rgba(99,102,241,0.3)]"
              >
                <h4 className="text-7xl font-black italic text-white drop-shadow-2xl">{mostVotedPlayer.name}</h4>
                <p className="mt-4 text-indigo-400 font-bold text-xl">{maxVotes} أصوات</p>
              </motion.div>
              <button
                onClick={finalizeGame}
                className="bg-indigo-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-xl flex items-center gap-3 animate-shimmer"
              >
                <span>{t.continue}</span>
                <ChevronRight size={32} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Initial Revelation state (existing logic enriched with UI polish)
  const isRevealSpy = spyIndices.includes(currentViewIndex);
  const isRevealedForCurrent = revealed.includes(currentViewIndex);

  return (
    <div className={`flex-1 flex flex-col p-8 pt-16 h-full ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} transition-all`}>
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black italic tracking-tighter mb-4 decoration-indigo-500 underline underline-offset-8">
           {isAr ? 'خبي الكلمة عن أي حد! 🤫' : 'Check Word & Hide! 🤫'}
        </h2>
        <div className="bg-indigo-500/10 inline-block px-10 py-3 rounded-full border border-indigo-500/20 shadow-inner">
           <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1 leading-none">{isAr ? 'الدور على الكابتن' : "PLAYER'S TURN"}</p>
           <p className="text-3xl font-black text-indigo-500 italic">{players[currentViewIndex].name}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!isRevealedForCurrent ? (
            <motion.button
              key="hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              onClick={handleReveal}
              className={`w-full aspect-square border-4 border-dashed rounded-[4rem] flex flex-col items-center justify-center gap-6 group hover:border-indigo-500 transition-all shadow-inner bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800`}
            >
              <div className="w-28 h-28 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center text-indigo-500 shadow-xl group-hover:bg-indigo-500 group-hover:text-white transition-all">
                 <Eye size={64} />
              </div>
              <span className="text-3xl font-black opacity-30 group-hover:opacity-100 transition-opacity">
                {isAr ? 'اضغط للإظهار' : 'Click to Reveal'}
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="revealed"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              className={`w-full aspect-square rounded-[4rem] flex flex-col items-center justify-center text-white p-12 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.5)] border-4 border-white/20 ${tProps.bg} ${tProps.font}`}
            >
              <div className="absolute inset-0 bg-black/10 rounded-[3.8rem] z-0"></div>
              <div className="relative z-10 flex flex-col items-center">
                {isRevealSpy ? (
                  <>
                    <Ghost size={100} className="mb-8 text-yellow-300 animate-bounce" />
                    <h3 className="text-5xl font-black tracking-tighter mb-4 italic">
                      {isAr ? 'أنت الجاسوس! 👽' : "You are the Spy! 👽"}
                    </h3>
                    <p className="text-xl font-bold opacity-70">
                       {isAr ? 'حاول تخدعهم، انت متعرفش الكلمة!' : "Fake it! You don't know the word."}
                    </p>
                  </>
                ) : (
                  <>
                    <Search size={100} className="mb-8 opacity-40 animate-pulse text-indigo-200" />
                    <p className="text-lg font-black uppercase tracking-[0.4em] opacity-60 mb-2">{isAr ? 'الكلمة السرية:' : 'THE WORD:'}</p>
                    <h3 className="text-4xl font-black italic tracking-tighter break-all">{word}</h3>
                    <div className="mt-8 bg-white/20 backdrop-blur-md px-8 py-2 rounded-full border border-white/20">
                      <p className="text-sm font-black uppercase tracking-widest">{category}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

          <div className="mt-auto space-y-4">
            <button
              onClick={handleNextReveal}
              disabled={!isRevealedForCurrent}
              className="w-full bg-indigo-600 text-white py-8 rounded-[3rem] font-black text-2xl shadow-2xl disabled:opacity-20 active:scale-95 transition-all touch-manipulation transform hover:-translate-y-2 flex items-center justify-center gap-4"
            >
              <span>{t.ready}</span>
              <ChevronRight size={32} strokeWidth={4} className={isAr ? '' : 'rotate-180'} />
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
  