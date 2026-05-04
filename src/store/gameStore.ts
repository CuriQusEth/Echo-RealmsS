import { create } from 'zustand';

export type GameState = 'menu' | 'playing' | 'realm_complete' | 'leaderboard';

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
  currentRealm: number;
  isHintActive: boolean;
  
  setGameState: (state: GameState) => void;
  incrementScore: (amount: number) => void;
  advanceRealm: () => void;
  toggleHint: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'menu',
  score: 0,
  longestRun: 0,
  currentRealm: 1,
  isHintActive: false,

  setGameState: (gameState) => set({ gameState }),
  
  incrementScore: (amount) => set((state) => ({ 
    score: state.score + amount,
    longestRun: Math.max(state.longestRun, state.currentRealm)
  })),
  
  advanceRealm: () => set((state) => ({ currentRealm: state.currentRealm + 1 })),
  toggleHint: () => set((state) => ({ isHintActive: !state.isHintActive })),
  
  resetGame: () => set({
    gameState: 'playing',
    score: 0,
    currentRealm: 1,
    isHintActive: false
  })
}));
