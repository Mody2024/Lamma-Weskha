
export const STORAGE_KEYS = {
  PLAYERS: 'dirty_gathering_players',
  SETTINGS: 'dirty_gathering_settings',
  CONTINUE_STATE: 'dirty_gathering_state',
};

export const persistenceService = {
  savePlayers: (players: any[]) => {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  },
  
  getPlayers: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return data ? JSON.parse(data) : [];
  },

  saveSettings: (settings: any) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getSettings: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  },

  saveGameState: (state: any) => {
    localStorage.setItem(STORAGE_KEYS.CONTINUE_STATE, JSON.stringify(state));
  },

  getGameState: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CONTINUE_STATE);
    return data ? JSON.parse(data) : null;
  },

  clearAll: () => {
    localStorage.clear();
  }
};
