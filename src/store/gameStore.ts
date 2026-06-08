import { create } from 'zustand';

export type GameState = 'title' | 'hub' | 'playing' | 'realm_complete' | 'leaderboard' | 'journal';

export interface ParticleState {
  id: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  createdAt: number;
}

interface GameStore {
  gameState: GameState;
  score: number;
  longestRun: number;
  echoCombo: number;
  maxEchoCombo: number;
  currentRealm: number;
  isHintActive: boolean;
  
  setGameState: (state: GameState) => void;
  incrementScore: (amount: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  advanceRealm: () => void;
  toggleHint: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'title',
  score: 0,
  longestRun: 0,
  echoCombo: 0,
  maxEchoCombo: 0,
  currentRealm: 1,
  isHintActive: false,

  setGameState: (gameState) => set({ gameState }),
  
  incrementScore: (amount) => set((state) => ({ 
    score: state.score + amount,
    longestRun: Math.max(state.longestRun, state.currentRealm)
  })),

  incrementCombo: () => set((state) => {
    const nextCombo = state.echoCombo + 1;
    return {
      echoCombo: nextCombo,
      maxEchoCombo: Math.max(state.maxEchoCombo, nextCombo)
    };
  }),

  resetCombo: () => set({ echoCombo: 0 }),
  
  advanceRealm: () => set((state) => ({ currentRealm: state.currentRealm + 1 })),
  toggleHint: () => set((state) => ({ isHintActive: !state.isHintActive })),
  
  resetGame: () => set({
    gameState: 'playing',
    score: 0,
    echoCombo: 0,
    currentRealm: 1,
    isHintActive: false
  })
}));
