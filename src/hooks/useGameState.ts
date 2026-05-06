import { useState, useEffect, useCallback } from 'react';
import { Player, GameType, GameState, GameSettings } from '../constants';

const STORAGE_KEY = 'dirty_gathering_players';
const SETTINGS_KEY = 'dirty_gathering_settings';

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  theme: 'dark',
  gameTime: 20,
  difficulty: 'متوسط',
  cardTheme: 'classic',
  spiesCount: 1,
  language: 'ar'
};

export function useGameState() {
  const [state, setState] = useState<GameState>({
    players: [],
    currentGame: null,
    phase: 'setup',
    currentPlayerIndex: 0,
    gameData: null,
    settings: DEFAULT_SETTINGS,
  });

  // Load players and settings from storage on debut
  useEffect(() => {
    const savedPlayers = localStorage.getItem(STORAGE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    setState(prev => ({
      ...prev,
      players: savedPlayers ? JSON.parse(savedPlayers) : [],
      settings: savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS,
      phase: savedPlayers && JSON.parse(savedPlayers).length > 0 ? 'menu' : 'setup'
    }));
  }, []);

  // Save changes to local storage
  useEffect(() => {
    if (state.players.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.players));
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  }, [state.players, state.settings]);

  const addPlayer = (name: string) => {
    setState(prev => ({
      ...prev,
      players: [...prev.players, { id: Math.random().toString(36).substr(2, 9), name, score: 0, roundsWon: 0 }]
    }));
  };

  const removePlayer = (id: string) => {
    setState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id)
    }));
  };

  const startGame = (type: GameType, category?: string) => {
    setState(prev => ({
      ...prev,
      currentGame: type,
      phase: 'explanation',
      currentPlayerIndex: Math.floor(Math.random() * prev.players.length),
      gameData: { category },
    }));
  };

  const nextPhase = (phase: GameState['phase'], data?: any) => {
    setState(prev => ({ ...prev, phase, gameData: data !== undefined ? data : prev.gameData }));
  };

  const updateCurrentPlayer = (index: number) => {
    setState(prev => ({ ...prev, currentPlayerIndex: index }));
  };

  const updateScore = (playerId: string, points: number) => {
    setState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, score: Math.max(0, p.score + points), roundsWon: points > 0 ? p.roundsWon + 1 : p.roundsWon } : p
      )
    }));
  };

  const updateSettings = (settings: Partial<GameSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  };

  const resetToMenu = () => {
    setState(prev => ({
      ...prev,
      currentGame: null,
      phase: 'menu',
      gameData: null,
    }));
  };

  const resetScores = () => {
    setState(prev => ({
      ...prev,
      players: prev.players.map(p => ({ ...p, score: 0, roundsWon: 0 }))
    }));
  };

  return {
    state,
    addPlayer,
    removePlayer,
    startGame,
    nextPhase,
    updateCurrentPlayer,
    updateScore,
    updateSettings,
    resetToMenu,
    resetScores,
  };
}
