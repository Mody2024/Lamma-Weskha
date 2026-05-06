/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameState } from './hooks/useGameState';

// Components
import SetupScreen from './components/SetupScreen';
import MenuScreen from './components/MenuScreen';
import PassingScreen from './components/PassingScreen';
import ExplanationScreen from './components/ExplanationScreen';
import ScoreboardScreen from './components/ScoreboardScreen';
import SettingsScreen from './components/SettingsScreen';
import Logo from './components/Logo';

// Games
import BombGame from './components/games/BombGame';
import SpyGame from './components/games/SpyGame';
import PressureGame from './components/games/PressureGame';
import FakeAnswerGame from './components/games/FakeAnswerGame';
import WhoAmongUsGame from './components/games/WhoAmongUsGame';
import SpeedChallengeGame from './components/games/SpeedChallengeGame';
import TrueOrFakeGame from './components/games/TrueOrFakeGame';
import DistortedWordGame from './components/games/DistortedWordGame';
import ConvincingAnswerGame from './components/games/ConvincingAnswerGame';
import FakeMemoryGame from './components/games/FakeMemoryGame';
import WhoCausedItGame from './components/games/WhoCausedItGame';
import ForbiddenWordGame from './components/games/ForbiddenWordGame';

import { soundService } from './services/soundService';

export default function App() {
  const { 
    state, 
    addPlayer, 
    removePlayer, 
    startGame, 
    nextPhase, 
    updateCurrentPlayer,
    updateScore,
    updateSettings,
    resetToMenu,
    resetScores
  } = useGameState();

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Apply theme class to body/html
  useEffect(() => {
    if (state.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Sync sound service with settings
    soundService.setEnabled(state.settings.soundEnabled);
  }, [state.settings.theme, state.settings.soundEnabled]);

  return (
    <div className="min-h-screen w-full flex justify-center bg-brand-bg dark:bg-slate-950 transition-colors duration-500">
      <div className="w-full max-w-md relative flex flex-col shadow-2xl bg-white dark:bg-slate-900 min-h-screen">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 10 }}
              className="relative"
            >
              <Logo size={200} />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <h2 className="text-3xl font-black text-white italic tracking-tighter">
                {state.settings.language === 'ar' ? 'اللمة الوسخة' : 'The Dirty Gathering'}
              </h2>
              <div className="mt-4 flex items-center justify-center gap-2">
                 <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key={state.currentGame || state.phase}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.2, ease: "easeOut" }}
           className="flex-1 flex flex-col"
        >
          {state.phase === 'setup' && (
            <SetupScreen 
              players={state.players} 
              onAdd={addPlayer} 
              onRemove={removePlayer} 
              onContinue={() => nextPhase('menu')} 
              settings={state.settings}
            />
          )}
          
          {state.phase === 'menu' && (
            <MenuScreen 
              onStart={startGame} 
              onOpenSettings={() => nextPhase('settings')}
              onOpenScores={() => nextPhase('scoreboard')}
              onBackToSetup={() => nextPhase('setup')}
              playersCount={state.players.length}
              settings={state.settings}
            />
          )}

          {state.phase === 'settings' && (
            <SettingsScreen 
              settings={state.settings}
              onUpdate={updateSettings}
              onBack={() => nextPhase('menu')}
              onReset={() => {
                resetScores();
                // We keep players but reset their scores for 'settings reset'
              }}
            />
          )}

          {state.phase === 'explanation' && (
            <ExplanationScreen 
              gameType={state.currentGame!}
              onContinue={() => nextPhase('passing')}
              onBackToMenu={resetToMenu}
              settings={state.settings}
            />
          )}

          {state.phase === 'passing' && (
            <PassingScreen 
              player={state.players[state.currentPlayerIndex]} 
              gameType={state.currentGame!}
              onReady={() => nextPhase('playing')} 
              onBackToMenu={resetToMenu}
              settings={state.settings}
            />
          )}

          {state.phase === 'scoreboard' && (
            <ScoreboardScreen 
              state={state}
              players={state.players}
              onContinue={() => nextPhase('menu')}
              onReset={resetToMenu}
              isGameOver={false}
            />
          )}

          {(state.phase === 'playing' || state.phase === 'voting' || state.phase === 'results') && (
            <>
              {state.currentGame === 'bomb' && (
                <BombGame 
                  state={state} 
                  nextPhase={nextPhase} 
                  updateCurrentPlayer={updateCurrentPlayer} 
                  updateScore={updateScore}
                  resetToMenu={resetToMenu} 
                  players={state.players} 
                  currentPlayer={state.players[state.currentPlayerIndex]} 
                />
              )}
              {state.currentGame === 'spy' && (
                <SpyGame 
                  state={state} 
                  nextPhase={nextPhase} 
                  updateCurrentPlayer={updateCurrentPlayer} 
                  updateScore={updateScore}
                  resetToMenu={resetToMenu} 
                  players={state.players} 
                />
              )}
              {state.currentGame === 'pressure' && (
                <PressureGame 
                  state={state} 
                  nextPhase={nextPhase} 
                  updateCurrentPlayer={updateCurrentPlayer} 
                  updateScore={updateScore}
                  resetToMenu={resetToMenu} 
                  players={state.players} 
                  currentPlayer={state.players[state.currentPlayerIndex]} 
                />
              )}
              {state.currentGame === 'fake_answer' && (
                <FakeAnswerGame 
                  state={state} 
                  nextPhase={nextPhase} 
                  updateCurrentPlayer={updateCurrentPlayer} 
                  updateScore={updateScore}
                  resetToMenu={resetToMenu} 
                  players={state.players} 
                />
              )}
              {state.currentGame === 'who_among_us' && (
                <WhoAmongUsGame 
                  state={state} 
                  nextPhase={nextPhase} 
                  updateScore={updateScore}
                  resetToMenu={resetToMenu} 
                  players={state.players} 
                />
              )}
              {state.currentGame === 'speed' && (
                <SpeedChallengeGame 
                  state={state} 
                  nextPhase={nextPhase} 
                  updateScore={updateScore}
                  resetToMenu={resetToMenu} 
                  players={state.players} 
                  currentPlayer={state.players[state.currentPlayerIndex]} 
                />
              )}
              {state.currentGame === 'fact_fiction' && (
                <TrueOrFakeGame 
                  state={state} 
                  nextPhase={nextPhase} 
                  updateScore={updateScore}
                  resetToMenu={resetToMenu} 
                  players={state.players} 
                  currentPlayer={state.players[state.currentPlayerIndex]} 
                />
              )}
              {state.currentGame === 'distorted_word' && (
                <DistortedWordGame 
                  state={state} 
                  nextPhase={nextPhase} 
                  updateScore={updateScore}
                  resetToMenu={resetToMenu}
                  players={state.players} 
                />
              )}
              {state.currentGame === 'convincing_answer' && (
                <ConvincingAnswerGame 
                  state={state} 
                  nextPhase={nextPhase} 
                  updateScore={updateScore}
                  resetToMenu={resetToMenu}
                  players={state.players} 
                />
              )}
              {state.currentGame === 'fake_memory' && (
                <FakeMemoryGame 
                  state={state} 
                  nextPhase={nextPhase} 
                  updateScore={updateScore}
                  resetToMenu={resetToMenu}
                  players={state.players} 
                />
              )}
              {state.currentGame === 'who_caused_it' && (
                <WhoCausedItGame 
                  state={state} 
                  nextPhase={nextPhase} 
                  updateScore={updateScore}
                  resetToMenu={resetToMenu}
                  players={state.players} 
                />
              )}
              {state.currentGame === 'forbidden_word' && (
                <ForbiddenWordGame 
                  state={state} 
                  nextPhase={nextPhase} 
                  updateScore={updateScore}
                  resetToMenu={resetToMenu}
                  players={state.players} 
                />
              )}
            </>
          )}
        </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
