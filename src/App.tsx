import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/web3/config';
import GameCanvas from './components/canvas/GameCanvas';
import TitleScreen from './components/ui/TitleScreen';
import HUD from './components/ui/HUD';
import RealmComplete from './components/ui/RealmComplete';
import { useGameStore } from './store/gameStore';
import { AnimatePresence } from 'motion/react';

const queryClient = new QueryClient();

function GameApp() {
  const gameState = useGameStore(state => state.gameState);

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden bg-[#0a0514] select-none text-white font-sans">
      {/* Ambient Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4c1d95] rounded-full blur-[120px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0891b2] rounded-full blur-[120px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#eab308] rounded-full blur-[100px] opacity-10 pointer-events-none z-0"></div>

      {/* Decorative Foreground Dust */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-30 z-0">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-cyan-200 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-purple-300 rounded-full blur-[2px]"></div>
      </div>

      <GameCanvas />
      
      {gameState === 'playing' && <HUD />}
      
      <AnimatePresence mode="wait">
        {gameState === 'menu' && <TitleScreen key="title" />}
        {gameState === 'realm_complete' && <RealmComplete key="realm-complete" />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GameApp />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

